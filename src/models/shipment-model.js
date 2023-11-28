import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  origin_country: { type: String, required: true },
  destination_country: { type: String, required: true },
  available: { type: Number, default: 1 },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Shipment = mongoose.model("Shipment", shipmentSchema);
