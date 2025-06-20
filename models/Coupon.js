import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["percentage", "fixed"], default: "fixed" },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date },
  minOrderAmount: { type: Number, default: 0 },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });


export default mongoose.model("Coupon", couponSchema);