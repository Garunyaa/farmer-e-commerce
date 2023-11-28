import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: Number, required: true, unique: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  profile_picture: [{ type: String }],
  kyc_document: [{ type: String }],
  kyc_verified: { type: Number, default: 2 },
  status: { type: Number, default: 1 },
  is_blocked: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() }
});

export const Buyer = mongoose.model("Buyer", buyerSchema);
