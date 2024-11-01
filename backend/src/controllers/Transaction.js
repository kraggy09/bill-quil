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
          approved: true,
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
    console.log("Error", error);

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

    // const length = customer1.transactions.length - 1;

    // if (customer1.transactions[length]) {
    //   const lastTransaction = await Transaction.findById(
    //     customer1.transactions[length]
    //   );

    //   // Check if the amount is the same and the transaction occurred within the last 2 minutes
    //   if (
    //     length != 0 &&
    //     lastTransaction != null &&
    //     lastTransaction.amount === amount &&
    //     moment().diff(moment(lastTransaction.createdAt), "minutes") <= 29
    //   ) {
    //     return res.status(409).json({
    //       msg: "Duplicate transaction found within 30 minutes",
    //       success: false,
    //     });
    //   }
    // }

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
          customer: customer1._id,
          approved: false,
        },
      ],
      { session }
    );

    // const customer = await Customer.findByIdAndUpdate(
    //   id,
    //   {
    //     $inc: { outstanding: -amount },
    //     $push: { transactions: newTransaction[0]._id },
    //   },
    //   { new: true, session }
    // );

    // const dailyReport = await DailyReport.findOneAndUpdate(
    //   { date: currentDate },
    //   {
    //     $push: { transactions: newTransaction[0]._id },
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //     session,
    //   }
    // );

    await session.commitTransaction();

    // if (customer) {
    //   return res.status(201).json({
    //     msg: "Payment received successfully",
    //     success: true,
    //     customer,
    //     newTransaction: newTransaction[0],
    //     dailyReport,
    //   });
    // }

    if (newTransaction) {
      return res.status(200).json({
        msg: "Request generated successfully",
        newTransaction,
      });
    }

    return res.status(201).json({ msg: "Payment not created", success: false });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return res.status(500).json({
      msg: "Server down",
      success: false,
    });
  } finally {
    session.endSession();
  }
};

export const approveTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let { id } = req.body;
  id = new mongoose.Types.ObjectId(id);

  try {
    let transaction = await Transaction.findOne({ _id: id }).session(session);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    let customerId = new mongoose.Types.ObjectId(transaction.customer);
    let customer = await Customer.findById(customerId).session(session);
    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.outstanding !== transaction.previousOutstanding) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        msg: "Outstanding not matching, please check",
        success: false,
        customer,
        transaction,
      });
    }

    customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $inc: { outstanding: -transaction.amount },
      },
      { new: true, session }
    );
    transaction.approved = true;
    await transaction.save({ session });

    const dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: { transactions: transaction._id },
      },
      {
        upsert: true,
        new: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      msg: "Transaction approved successfully",
      success: true,
      customer,
      transaction,
      dailyReport,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({
      msg: "An error occurred while approving the transaction",
      success: false,
      error: error.message,
    });
  }
};

export const rejectTransaction = async (req, res) => {
  let { id } = req.body;
  id = new mongoose.Types.ObjectId(id);
  // console.log(id);
  try {
    let transaction = await Transaction.findOneAndDelete({ _id: id });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return res.status(200).json({
      success: true,
      msg: "Transaction deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    // Fetch transactions with approved set to false
    const transactions = await Transaction.find({ approved: false });

    // Return successful response with the transactions
    return res.status(200).json({
      success: true,
      msg: "Transactions found successfully",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);

    // Return error response
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching transactions",
      error: error.message,
    });
  }
};
