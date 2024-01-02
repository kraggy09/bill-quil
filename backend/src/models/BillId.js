import moment from "moment-timezone";
import mongoose from "mongoose";
import getCurrentDateAndTime from "../config/getCurrentTime.js";

const IST = "Asia/Kolkata"; // Define the timezone

const BillIdSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },

  expires: {
    type: Date,
    default: () => moment.tz(getCurrentDateAndTime(), IST),
    expires: 60 * 24 * 60 * 60, // 60 days expiration time
  },
});

BillIdSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("BillId", BillIdSchema);
