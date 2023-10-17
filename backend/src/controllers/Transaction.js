import getDate from "../config/getDate.js";
import Customer from "../models/Customer.js";
import DailyReport from "../models/DailyReport.js";
import Transaction from "../models/Transaction.js";
const currentDate = getDate();

export const createNewTransaction = async (req, res) => {
  try {
    const { name, amount, purpose } = req.body;
    const newTransaction = await Transaction.create({
      name,
      amount,
      taken: true,
      purpose,
    });

    const dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: { transactions: newTransaction._id },
      }
    );

    //Logic to be written for adding this transaction in the dailyreport

    return res.status(201).json({
      msg: "Transaction added successfully",
      success: true,
      newTransaction,
    });
  } catch (error) {
    console.log("Error");

    return res.status(500).json({
      msg: "Server error",
      success: true,
    });
  }
};

export const createNewPayment = async (req, res) => {
  try {
    const { name, amount } = req.body;
    const newTransaction = await Transaction.create({
      name,
      amount,
      taken: false,
      purpose: "Payment",
    });
    const customer = await Customer.findOneAndUpdate(
      { name: name },
      {
        $inc: { outstanding: -amount },
        $push: { transactions: newTransaction._id }, // Corrected $push usage
      },
      { new: true }
    );

    const dailyReport = await DailyReport.findOneAndUpdate(
      { date: currentDate },
      {
        $push: { transactions: newTransaction._id },
      }
    );
    if (customer) {
      return res.status(201).json({
        msg: "Payment recieved successfully",
        success: true,
        customer,
        newTransaction,
        dailyReport,
      });
    }
    return res.status(201).json({ msg: "Payment not created", success: false });
  } catch (error) {
    return res.status(500).json({
      msg: "Server down",
      success: false,
    });
  }
};
