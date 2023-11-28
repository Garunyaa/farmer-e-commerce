import mongoose from "mongoose";

const farmerProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  images: [{ data: Buffer, content_type: String }],
  quantity: { type: Number, required: true },
  approved: { type: Number, default: 0 },
  status: { type: Number, default: 1 },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  created_at: { type: Date, default: Date.now() }
});

export const farmerProduct = mongoose.model("farmerProduct", farmerProductSchema);
