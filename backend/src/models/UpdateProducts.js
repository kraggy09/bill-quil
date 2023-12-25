import mongoose from "mongoose";
import moment from "moment-timezone";
import getCurrentDateAndTime from "../config/getCurrentTime.js";

// Set the timezone to IST
const IST = "Asia/Kolkata";

const updateProductSchema = mongoose.Schema({
  date: {
    type: Date,
    default: () => moment.tz(getCurrentDateAndTime(), IST),
  },
  createdBy: {
    type: String,
    required: true,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  oldStock: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("updateProduct", updateProductSchema);
