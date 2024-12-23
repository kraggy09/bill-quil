import mongoose from "mongoose";
import moment from "moment-timezone";
import getDate from "../config/getDate.js";
import getCurrentDateAndTime from "../config/getCurrentTime.js";

// Set the timezone to IST
const IST = "Asia/Kolkata";

const currentDate = getDate(); // You can format this date as needed

const dailyReportSchema = mongoose.Schema({
  date: {
    type: String,
    default: currentDate,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  updatedToday: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      previousQuantity: {
        type: Number,
        required: true,
      },
      quantity: { type: Number, required: true },
      purpose: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: () => moment.tz(getCurrentDateAndTime(), IST),
      },
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
  createdAt: {
    type: Date,
    default: () => moment.tz(getCurrentDateAndTime(), IST),
  },
  expires: {
    type: Date,
    expires: 60 * 24 * 60 * 60, // Set TTL index for 60 days
    default: () => moment.tz(getCurrentDateAndTime(), IST),
  },
});

dailyReportSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const DailyReport = mongoose.model("DailyReport", dailyReportSchema);

export default DailyReport;
