import mongoose from "mongoose";
const getDate = () => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  return currentDate;
};

const date = Date.now();
const newDate = getDate();
const transactionSchema = mongoose.Schema({
  date: {
    type: String,
    default: newDate,
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
    default: date,
    // Set to expire after 60 days (in seconds)
    expires: 60 * 60 * 24 * 60,
  },
  paymentMode: {
    type: String,
    enum: ["cash", "online"],
    required: true,
  },
});

export default mongoose.model("Transaction", transactionSchema);
