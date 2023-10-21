import mongoose from "mongoose";

const currentDate = Date.now();
const billSchema = mongoose.Schema({
  date: {
    type: Date,
    default: currentDate,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  createdAt: {
    type: Date,
    default: currentDate, // Set the default value to the current date
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
    // Specify the TTL (Time to Live) value in seconds (30 days)
    expires: 30 * 24 * 60 * 60,
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
