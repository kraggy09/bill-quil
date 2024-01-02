import mongoose from "mongoose";
import getDate from "../config/getDate.js";
import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import BillId from "../models/BillId.js";

export const createBill = async (req, res) => {
  const currentDate = getDate();
  const products = req.body.purchased;
  let {
    customerId,
    billId,
    total,
    payment = 0,
    paymentMode,
    discount = 0,
    createdBy,
  } = req.body;
  console.log(billId);
  let newBillId = billId;
  newBillId = billId + 1;
  console.log(newBillId);

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

    const items = await Promise.all(
      products.map(async (product) => {
        const quantity =
          product.piece +
          product.packet * product.packetQuantity +
          product.box * product.boxQuantity;
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
    const idS = await BillId.create({
      id: newBillId,
    });

    const newBill = await Bill.create(
      [
        {
          customer: customerId,
          items: items,
          total,
          payment,
          discount,
          createdBy,
          id: idS._id,
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
            previousOutstanding: customer.outstanding,
            newOutstanding: total - payment,
            taken: false,
            paymentMode,
          },
        ],
        { session }
      );
    }

    // Update the customer's bills array with the newly created bill
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        outstanding: total - payment,
        $push: {
          transactions: transaction ? transaction._id : null,
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
    console.log(start);
    const end = new Date(endDate);
    console.log(end);
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
    console.log(error);
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
