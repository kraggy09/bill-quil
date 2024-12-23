import mongoose from "mongoose";
import moment from "moment-timezone";
import getCurrentDateAndTime from "../config/getCurrentTime.js";

// Set the timezone to IST
const IST = "Asia/Kolkata";

const billSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: () => moment.tz(getCurrentDateAndTime(), IST),
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  createdAt: {
    type: Date,
    expires: 60 * 60 * 24 * 60,

    default: () => moment.tz(getCurrentDateAndTime(), IST),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      previousQuantity: {
        type: Number,
        required: true,
      },
      newQuantity: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
        enum: ["wholesale", "retail", "superWholesale"],
      },
      total: {
        type: Number,
        required: true,
      },
      costPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  expires: {
    type: Date,
    default: () => moment.tz(getCurrentDateAndTime(), IST),
    expires: 60 * 24 * 60 * 60,
    default: () => moment.tz(getCurrentDateAndTime(), IST),
  },
  total: {
    type: Number,
    required: true,
  },
  payment: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
});

// Create an index on the "expires" field for TTL
billSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const Bill = mongoose.model("Bill", billSchema);

export default Bill;
