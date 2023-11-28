import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "farmerProduct", required: true },
  quantity: { type: Number, required: true },
  total_price: { type: Number },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  origin_country: { type: String },
  destination_country: { type: String },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Order = mongoose.model("Order", orderSchema);
