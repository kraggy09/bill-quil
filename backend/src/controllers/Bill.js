import mongoose from "mongoose";
import getDate from "../config/getDate.js";
import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import BillId from "../models/BillId.js";
import moment from "moment-timezone";

export const createBill = async (req, res) => {
  const currentDate = getDate();
  const products = req.body.purchased;
  let {
    customerId,
    billId,
    payment = 0,
    paymentMode,
    discount = 0,
    createdBy,
  } = req.body;
  let newBillId = billId;
  newBillId = billId + 1;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the customer exists
    const previousBillId = await BillId.findOne({ id: newBillId });
    if (previousBillId) {
      return res.status(409).json({
        msg: "Duplicate bill detected pls check your history",
        success: false,
        previousBillId,
      });
    }

    const customer = await Customer.findById(customerId).session(session);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    let billTotal = 0;
    const items = await Promise.all(
      products.map(async (product) => {
        const quantity =
          product.piece +
          product.packet * product.packetQuantity +
          product.box * product.boxQuantity;
        billTotal += product.total;
        const id = new mongoose.Types.ObjectId(product.id);
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            $inc: { stock: -quantity },
          },
          { new: true, session }
        );

        return {
          product: updatedProduct._id,
          quantity: quantity,
          discount: product.discount || 0,
          type: product.type,
          total: product.total,
        };
      })
    );
    billTotal = Math.ceil(billTotal);
    billTotal += customer.outstanding;
    billTotal -= discount;
    const idS = await BillId.create(
      [
        {
          id: newBillId,
        },
      ],
      { session }
    );
    // console.log(idS[0]);
    const newBill = await Bill.create(
      [
        {
          customer: customerId,
          items: items,
          total: billTotal,
          payment,
          discount,
          createdBy,
          id: idS[0]._id,
        },
      ],
      { session }
    );

    let transaction = null;
    let dailyReport = null;
    if (payment > 0) {
      transaction = await Transaction.create(
        [
          {
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
    }

    // Update the customer's bills array with the newly created bill
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        outstanding: billTotal - payment,
        $push: {
          transactions: transaction ? transaction[0]._id : null,
          bills: newBill[0]._id,
        },
      },
      { session }
    );

    dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: {
          transactions: transaction ? transaction[0]._id : null,
          bills: newBill ? newBill[0]._id : null,
        },
      },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      message: "Bill created successfully",
      data: {
        bill: newBill[0],
        updatedCustomer,
        dailyReport,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating bill:", error);
    return res.status(500).json({ error: "Error creating bill" });
  } finally {
    session.endSession();
  }
};

export const getBillDetails = async (req, res) => {
  try {
    const id = req.query.id;
    const bills = await Bill.findById(id)
      .populate("items.product")
      .populate("customer")
      .populate("id");

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
    const latestBill = await BillId.findOne().sort({ expires: -1 }).exec();
    if (latestBill) {
      return res.status(200).json({
        billId: latestBill.id,
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
