import mongoose from "mongoose";
import getDate from "../config/getDate.js";
import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import BillId from "../models/BillId.js";
import moment from "moment-timezone";
import Logger from "../models/Logger.js";
import Counter from "../models/Counter.js";

// Done with the transaction with full testing tested ok.

//Todo: Write an API to basically handle the swap of bill in case of wrong billing by mistake only for admin in (Admin Route Be Cautious)

export const createBill = async (req, res) => {
  const currentDate = getDate();
  const products = req.body.purchased;
  let {
    customerId,
    billId,
    transactionId,
    payment = 0,
    paymentMode,
    discount = 0,
    createdBy,
  } = req.body;

  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const previousBillId = await Counter.findOne({ name: "billId" });
      const previousTransactionId = await Counter.findOne({
        name: "transactionId",
      }).session(session);

      if (previousTransactionId.value != transactionId) {
        throw new Error("Duplicate Transaction !! Pls refresh");
      }

      if (previousBillId.value != billId) {
        console.log(previousBillId, billId, "Actual BIll Id");
        throw new Error("Duplicate bill !! Pls refresh");
      }

      const customer = await Customer.findById(customerId).session(session);
      if (!customer) {
        throw new Error("Customer not found");
      }

      let billTotal = 0;
      const items = [];
      const productBulkOperations = [];
      const loggerEntries = [];

      for (const product of products) {
        const quantity =
          product.piece +
          product.packet * product.packetQuantity +
          product.box * product.boxQuantity;
        billTotal += product.total;

        const id = new mongoose.Types.ObjectId(product.id);

        // Add product stock update operation to bulk array
        productBulkOperations.push({
          updateOne: {
            filter: { _id: id },
            update: { $inc: { stock: -quantity } },
          },
        });

        // Add logger entry
        const availableProduct = await Product.findById(id).session(session);
        if (!availableProduct) {
          throw new Error(`Product not found: ${product.name || product.id}`);
        }

        loggerEntries.push({
          name: "Billing",
          previousQuantity: availableProduct.stock,
          quantity: quantity,
          newQuantity: availableProduct.stock - quantity,
          product: availableProduct._id,
        });

        items.push({
          costPrice: availableProduct.costPrice,
          previousQuantity: availableProduct.stock,
          newQuantity: availableProduct.stock - quantity,
          product: availableProduct._id,
          quantity: quantity,
          discount: product.discount || 0,
          type: product.type,
          total: product.total,
        });
      }

      // Execute the bulk write operation for stock updates
      const bulkWriteResult = await Product.bulkWrite(productBulkOperations, {
        session,
      });

      if (bulkWriteResult.modifiedCount !== products.length) {
        throw new Error("Failed to update all product stocks");
      }

      await Logger.insertMany(loggerEntries, { session });

      billTotal = Math.ceil(billTotal + customer.outstanding - discount);

      const newBillId = await Counter.findOneAndUpdate(
        { name: "billId" },
        { $inc: { value: 1 } },
        { new: true, session }
      );

      if (!newBillId) {
        throw new Error("Error while creating bill id");
      }

      const newBill = await Bill.create(
        [
          {
            customer: customerId,
            items: items,
            total: billTotal,
            payment,
            discount,
            createdBy,
            id: newBillId.value,
          },
        ],
        { session }
      );

      if (!newBill[0]) {
        throw new Error("Unable to create the bill");
      }

      let transaction = null;
      if (payment > 0) {
        let newTransId = await Counter.findOneAndUpdate(
          { name: "transactionId" },
          {
            $inc: { value: 1 },
          },
          { new: true, session }
        );
        transaction = await Transaction.create(
          [
            {
              id: newTransId.value,
              name: customer.name,
              purpose: "Payment",
              amount: payment,
              previousOutstanding: billTotal,
              newOutstanding: billTotal - payment,
              taken: false,
              paymentMode,
              approved: true,
              customer: customer._id,
            },
          ],
          { session }
        );

        if (!transaction[0]) {
          throw new Error("Unable to create the transaction");
        }
      }

      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        {
          outstanding: billTotal - payment,
        },
        { session }
      );

      if (!updatedCustomer) {
        throw new Error("Unable to update the customer's outstanding balance");
      }

      const dailyReport = await DailyReport.findOneAndUpdate(
        { date: currentDate },
        {
          $push: {
            transactions: transaction ? transaction[0]._id : null,
            bills: newBill[0]._id,
          },
        },
        { upsert: true, new: true, session }
      );

      if (!dailyReport) {
        throw new Error("Unable to update the daily report");
      }

      return {
        bill: newBill[0],
        updatedCustomer,
        dailyReport,
      };
    });

    session.endSession();

    return res.status(201).json({
      message: "Bill created successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error creating bill:", error);
    return res.status(500).json({
      msg: error.message,
      success: false,
    });
  } finally {
    // if (session.inTransaction()) {
    //   console.log("I was called even when the session ended");

    //   await session.abortTransaction();
    // }
    session.endSession();
  }
};

export const getBillDetails = async (req, res) => {
  try {
    const id = req.query.id;
    const bills = await Bill.findById(id)
      .populate("items.product")
      .populate("customer");

    if (!bills) {
      return res.status(404).json({
        msg: "Failed to get the data of the bill",
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Found the bills",
      success: true,
      bills,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};

export const getAllBillsOfToday = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    // console.log(start);
    const end = new Date(endDate);
    // console.log(end);
    end.setHours(23, 59, 59, 59);
    const bills = await Bill.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).populate("items.product");
    if (bills) {
      return res.status(200).json({
        msg: "Bills Found",
        bills,
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};

export const getLatestBillId = async (req, res) => {
  try {
    const latestBill = await Counter.findOne({ name: "billId" });
    if (latestBill) {
      return res.status(200).json({
        billId: latestBill.value,
        msg: "Latest Bill Id",
        success: true,
      });
    }
    return res.status(404).json({
      msg: "Bill Id not found restart",
      success: false,
    });
  } catch (error) {
    console.error("Error retrieving latest bill:", error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const IST = "Asia/Kolkata"; // Update with the correct path

export async function getBillsByProductNameAndDate(req, res) {
  const { product, startDate, endDate } = req.query;

  const barcode = product.barcode.map((code) => parseInt(code));

  // console.log(barcode);

  try {
    const startMoment = moment(startDate).startOf("day").tz(IST);
    const endMoment = moment(endDate).endOf("day").tz(IST);

    const result = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: startMoment.toDate(), $lte: endMoment.toDate() },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $match: {
          "productDetails.barcode": { $in: barcode },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdByDetails",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $addFields: {
          createdBy: { $arrayElemAt: ["$createdByDetails", 0] },
          customer: { $arrayElemAt: ["$customerDetails", 0] },
        },
      },
      {
        $group: {
          _id: "$_id",
          date: { $first: "$date" },
          createdAt: { $first: "$createdAt" },
          items: { $push: "$items" },
          expires: { $first: "$expires" },
          total: { $first: "$total" },
          payment: { $first: "$payment" },
          discount: { $first: "$discount" },
          createdBy: { $first: "$createdBy" },
          customer: { $first: "$customer" },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    // // Handling no bills found
    // if (result.length === 0) {
    //   return res.status(404).json({
    //     msg: "No bills found for the given criteria",
    //   });
    // }

    return res.status(200).json({
      msg: "Received successfully",
      result,
    });
  } catch (error) {
    console.error(error);

    // Handling errors and sending an error response
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
