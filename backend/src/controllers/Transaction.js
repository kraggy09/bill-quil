import moment from "moment-timezone";
import getDate from "../config/getDate.js";
import Customer from "../models/Customer.js";
import DailyReport from "../models/DailyReport.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
const currentDate = getDate();

export const createNewTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, amount, purpose } = req.body;

    const newTransaction = await Transaction.create(
      [
        {
          name,
          amount,
          taken: true,
          purpose,
          paymentMode: "cash",
        },
      ],
      { session }
    );

    const dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: { transactions: newTransaction[0]._id },
      },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      msg: "Transaction added successfully",
      success: true,
      newTransaction: newTransaction[0],
      dailyReport,
    });
  } catch (error) {
    await session.abortTransaction();
    // console.log("Error", error);

    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  } finally {
    session.endSession();
  }
};

export const createNewPayment = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    let { name, id, amount, paymentMode } = req.body;
    name = name.toLowerCase();
    id = new mongoose.Types.ObjectId(id);

    amount = Number(amount);

    const customer1 = await Customer.findById(id).session(session);
    if (!customer1) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const length = customer1.transactions.length - 1;
    // console.log(length, "Length");
    // console.log(customer1.transactions[length]);
    if (customer1.transactions[length]) {
      const lastTransaction = await Transaction.findById(
        customer1.transactions[length]
      );

      // Check if the amount is the same and the transaction occurred within the last 2 minutes
      if (
        lastTransaction.amount === amount &&
        moment().diff(moment(lastTransaction.createdAt), "minutes") <= 2
      ) {
        return res.status(409).json({
          msg: "Duplicate transaction found within 2 minutes",
          success: false,
        });
      }
    }

    const previousOutstanding = customer1.outstanding;
    const newOutstanding = customer1.outstanding - amount;

    const newTransaction = await Transaction.create(
      [
        {
          name,
          previousOutstanding,
          amount,
          newOutstanding,
          taken: false,
          purpose: "Payment",
          paymentMode,
        },
      ],
      { session }
    );

    const customer = await Customer.findByIdAndUpdate(
      id,
      {
        $inc: { outstanding: -amount },
        $push: { transactions: newTransaction[0]._id },
      },
      { new: true, session }
    );

    const dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: { transactions: newTransaction[0]._id },
      },
      {
        upsert: true,
        new: true,
        session,
      }
    );

    await session.commitTransaction();

    if (customer) {
      return res.status(201).json({
        msg: "Payment received successfully",
        success: true,
        customer,
        newTransaction: newTransaction[0],
        dailyReport,
      });
    }

    return res.status(201).json({ msg: "Payment not created", success: false });
  } catch (error) {
    await session.abortTransaction();
    // console.log(error);
    return res.status(500).json({
      msg: "Server down",
      success: false,
    });
  } finally {
    session.endSession();
  }
};
