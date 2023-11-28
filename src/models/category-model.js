import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() }
});

export const Category = mongoose.model("Category", categorySchema);
