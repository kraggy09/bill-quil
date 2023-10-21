import mongoose from "mongoose";
import nodeCron from "node-cron";
import getDate from "../config/getDate.js";

// Define your Mongoose schema for DailyReport
const currentDate = getDate(); // You can format this date as needed

const dailyReportSchema = mongoose.Schema({
  date: {
    type: String,
    default: currentDate, // Set the default date to the current date
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  bills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
    },
  ],
  cashIn: {
    type: Number,
    default: 0,
  },
});

const DailyReport = mongoose.model("DailyReport", dailyReportSchema);

export default DailyReport;
