import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
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
    default: Date.now,
    // Set to expire after 60 days (in seconds)
    expires: 60 * 60 * 24 * 60,
  },
});

export default mongoose.model("Transaction", transactionSchema);
