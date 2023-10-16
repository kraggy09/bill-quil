import mongoose from "mongoose";
const billSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date
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
    },
  ],
  expires: {
    type: Date,
    // Specify the TTL (Time to Live) value in seconds (30 days)
    expires: 30 * 24 * 60 * 60,
  },
});

// Create an index on the "expires" field for TTL
billSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Bill", billSchema);
