import mongoose from "mongoose";
import moment from "moment-timezone";
import getDate from "../config/getDate.js";
import getCurrentDateAndTime from "../config/getCurrentTime.js";

// Set the timezone to IST
const IST = "Asia/Kolkata";

const newDate = getDate();

const transactionSchema = mongoose.Schema({
  date: {
    type: String,
    default: newDate,
  },
  previousOutstanding: {
    type: Number,
  },
  newOutstanding: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  purpose: String,
  amount: {
    required: true,
    type: Number,
  },
  taken: {
    required: true,
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: () => moment.tz(getCurrentDateAndTime(), IST),
    expires: 60 * 60 * 24 * 60,
  },
  paymentMode: {
    type: String,
    enum: ["cash", "online", "productReturn"],
    required: true,
  },
  expires: {
    type: Date,
    expires: 60 * 24 * 60 * 60,
    default: () => moment.tz(getCurrentDateAndTime(), IST),
  },
});

transactionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Transaction", transactionSchema);
