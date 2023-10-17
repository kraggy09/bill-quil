import mongoose from "mongoose";
import getDate from "../config/getDate.js";

const date = new Date();
const currentDate = getDate();
console.log(currentDate);
const dailyReport = mongoose.Schema({
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

export default mongoose.model("DailyReport", dailyReport);
