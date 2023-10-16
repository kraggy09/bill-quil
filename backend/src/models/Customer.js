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
  outstanding: {
    type: Number,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
