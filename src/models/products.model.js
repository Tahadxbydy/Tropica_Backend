import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  catagory: { type: mongoose.Schema.Types.ObjectId, ref: "catagories" },
  description: {
    type: String,
  },
  images: { type: Array, required: true },
  variatons: { type: Array, required: false },
  instock: { type: Int32Array, default: 0, required: false },
});

export const productModel = mongoose.model("product", productSchema);
