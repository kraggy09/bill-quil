import mongoose from "mongoose";
import getDate from "../config/getDate.js";
import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import DailyReport from "../models/DailyReport.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

export const createBill = async (req, res) => {
  const currentDate = getDate();
  const products = req.body.purchased;
  const {
    customerId,
    total,
    payment = 0,
    paymentMode,
    discount = 0,
  } = req.body;

  try {
    // Check if the customer exists
    const customer = await Customer.findById(customerId);
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
          { new: true }
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

    const newBill = await Bill.create({
      customer: customerId,
      items: items,
      total,
      payment,
      discount,
    });

    let transaction = null;
    let dailyReport = null;
    if (payment > 0) {
      transaction = await Transaction.create({
        name: customer.name,
        purpose: "Payment",
        amount: payment,
        previousOutstanding: customer.outstanding,
        newOutstanding: total - payment,
        taken: false,
        paymentMode,
      });
    }

    // Update the customer's bills array with the newly created bill
    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, {
      outstanding: total - payment,
      $push: {
        transactions: transaction ? transaction._id : null,
        bills: newBill._id,
      },
    });

    dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: {
          transactions: transaction ? transaction._id : null,
          bills: newBill ? newBill._id : null,
        },
      },
      { upsert: true, new: true }
    );

    if (updatedCustomer) {
      return res.status(201).json({
        message: "Bill created successfully",
        data: {
          bill: newBill,
          updatedCustomer,
          dailyReport,
        },
      });
    }
  } catch (error) {
    console.log("Error creating bill:", error);
    return res.status(500).json({ error: "Error creating bill" });
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
    const date = new Date();
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
