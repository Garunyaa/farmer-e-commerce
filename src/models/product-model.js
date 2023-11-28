import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true, unique: true },
  price: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Product = mongoose.model("Product", productSchema);
