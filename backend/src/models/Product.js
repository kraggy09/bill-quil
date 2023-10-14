import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    reuired: true,
  },
  mrp: {
    type: Number,
    reuired: true,
  },
  costPrice: {
    type: Number,
    reuired: true,
  },
  measuring: {
    type: String,
    enum: ["kg", "piece"],
    required: true,
  },
  retailPrice: {
    type: Number,
    reuired: true,
  },
  wholesalePrice: {
    type: Number,
    reuired: true,
  },
  barcode: {
    type: Number,
    reuired: true,
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
});

export default mongoose.model("Product", productSchema);
