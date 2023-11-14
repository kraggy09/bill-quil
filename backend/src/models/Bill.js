import mongoose from "mongoose";
import moment from "moment-timezone";
import getCurrentDateAndTime from "../config/getCurrentTime.js";

// Set the timezone to IST
const IST = "Asia/Kolkata";

const billSchema = mongoose.Schema({
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
    default: () => moment.tz(getCurrentDateAndTime(), IST),
  },
  items: [
    {
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
        enum: ["wholesale", "retail"],
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  expires: {
    type: Date,
    expires: 30 * 24 * 60 * 60,
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

export default mongoose.model("Bill", billSchema);
