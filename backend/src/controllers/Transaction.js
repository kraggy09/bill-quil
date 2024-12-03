import getDate from "../config/getDate.js";
import Customer from "../models/Customer.js";
import DailyReport from "../models/DailyReport.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import Counter from "../models/Counter.js";
const currentDate = getDate();

//TODO: Test regressly whether it is working or not
export const createNewTransaction = async (req, res) => {
  const { name, amount, purpose, transactionId } = req.body;
  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      // Check if the transaction ID is valid
      const previousTransactionId = await Counter.findOne({
        name: "transactionId",
      }).session(session);

      if (previousTransactionId.value !== transactionId) {
        throw new Error("Duplicate transaction!! Please refresh.");
      }

      // Increment transaction ID
      const newTransactionId = await Counter.findOneAndUpdate(
        { name: "transactionId" },
        { $inc: { value: 1 } },
        { session, new: true }
      );

      if (!newTransactionId) {
        throw new Error("Error generating new transaction ID.");
      }

      // Create the new transaction
      const newTransaction = await Transaction.create(
        [
          {
            id: newTransactionId.value,
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

      if (!newTransaction || newTransaction.length === 0) {
        throw new Error("Error creating the transaction.");
      }

      // Update or create the daily report
      const currentDate = getDate(); // Ensure you have this helper function available
      const dailyReport = await DailyReport.findOneAndUpdate(
        { date: currentDate },
        {
          $push: { transactions: newTransaction[0]._id },
        },
        { upsert: true, new: true, session }
      );

      if (!dailyReport) {
        throw new Error("Error updating the daily report.");
      }

      return {
        newTransaction: newTransaction[0],
        dailyReport,
      };
    });

    session.endSession();

    return res.status(201).json({
      msg: "Transaction added successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      msg: error.message || "Server error",
      success: false,
    });
  } finally {
    session.endSession();
  }
};
//TODO: Test regressly whether it is working or not

export const createNewPayment = async (req, res) => {
  let { name, id, amount, paymentMode, transactionId } = req.body;
  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      name = name.toLowerCase();
      id = new mongoose.Types.ObjectId(id);
      amount = Number(amount);

      const previousTransactionId = await Counter.findOne({
        name: "transactionId",
      }).session(session);

      if (previousTransactionId.value !== transactionId) {
        throw new Error("Duplicate transaction!! Please refresh.");
      }

      // Fetch the customer
      const customer = await Customer.findById(id).session(session);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const previousOutstanding = customer.outstanding;
      const newOutstanding = previousOutstanding - amount;

      let updatedTransactionId = await Counter.findOneAndUpdate(
        { name: "transactionId" },
        {
          $inc: { value: 1 },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedTransactionId) {
        throw new Error("Error while creating transaction id");
      }
      // Create the new transaction
      const newTransaction = await Transaction.create(
        [
          {
            id: updatedTransactionId.value,
            name,
            previousOutstanding,
            amount,
            newOutstanding,
            taken: false,
            purpose: "Payment",
            paymentMode,
            customer: customer._id,
            approved: false,
          },
        ],
        { session }
      );

      if (!newTransaction || newTransaction.length === 0) {
        throw new Error("Error creating the payment transaction.");
      }

      return {
        newTransaction: newTransaction[0],
      };
    });

    session.endSession();

    return res.status(201).json({
      msg: "Payment received successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      msg: error.message || "Server error",
      success: false,
    });
  } finally {
    session.endSession();
  }
};

//TODO: Test regressly whether it is working or not
export const approveTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  let customer, transaction, dailyReport;

  try {
    await session.withTransaction(async () => {
      const { id } = req.body;

      // Fetch the transaction
      transaction = await Transaction.findById(id).session(session);
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Fetch the customer associated with the transaction
      customer = await Customer.findById(transaction.customer).session(session);
      if (!customer) {
        throw new Error("Customer not found");
      }

      // Validate outstanding balance
      if (customer.outstanding !== transaction.previousOutstanding) {
        const error = new Error("Outstanding not matching, please check");
        error.statusCode = 404;
        error.data = { customer, transaction };
        throw error;
      }

      // Update customer's outstanding balance
      customer = await Customer.findByIdAndUpdate(
        transaction.customer,
        { $inc: { outstanding: -transaction.amount } },
        { new: true, session }
      );

      // Approve the transaction
      transaction.approved = true;
      await transaction.save({ session });

      // Update the daily report
      const currentDate = getDate();
      dailyReport = await DailyReport.findOneAndUpdate(
        { date: currentDate },
        { $push: { transactions: transaction._id } },
        { upsert: true, new: true, session }
      );
    });

    // Success response
    return res.status(200).json({
      msg: "Transaction approved successfully",
      success: true,
      customer,
      transaction,
      dailyReport,
    });
  } catch (error) {
    if (error.statusCode == 404) {
      return res.status(404).json({
        msg: "Outstanding not matching, please check",
        success: false,
        customer: error.data.customer,
        transaction: error.data.transaction,
      });
    }
    console.error("Error while approving transaction:", error.message);

    return res.status(500).json({
      msg: "An error occurred while approving the transaction",
      success: false,
      error: error.message,
    });
  } finally {
    // Ensure the session is ended
    session.endSession();
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

export const getLatestTransactionId = async (req, res) => {
  try {
    const latestTransactionId = await Counter.findOne({
      name: "transactionId",
    });
    if (latestTransactionId) {
      return res.status(200).json({
        transactionId: latestTransactionId.value,
        msg: "Latest Transaction Id",
        success: true,
      });
    }
    return res.status(404).json({
      msg: "Transaction Id not found restart",
      success: false,
    });
  } catch (error) {
    console.error("Error retrieving latest Transaction:", error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
