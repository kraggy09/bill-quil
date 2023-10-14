import mongoose from "mongoose";

const updateProductSchema = mongoose.Schema({
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

export default mongoose.model("updateProduct", updateProductSchema);
