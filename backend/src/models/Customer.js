import mongoose from "mongoose";
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
    },
  ],
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  outstanding: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
