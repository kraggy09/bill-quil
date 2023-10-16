import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  measuring: {
    type: String,
    enum: ["kg", "piece"],
    required: true,
  },
  retailPrice: {
    type: Number,
    required: true,
  },
  wholesalePrice: {
    type: Number,
    required: true,
  },
  barcode: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  packet: {
    type: Number,
    required: true,
  },
  box: {
    type: Number,
    required: true,
  },
});

productSchema.virtual("totalPackets").get(function () {
  return Math.floor(this.stock / this.packet);
});

productSchema.virtual("totalStock").get(function () {
  const box = Math.floor(this.stock / this.box);
  const remainingItem = this.stock % this.box;
  return box + remainingItem; // You were missing the return statement
});

export default mongoose.model("Product", productSchema);
