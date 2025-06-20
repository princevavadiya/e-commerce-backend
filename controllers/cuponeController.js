import mongoose from "mongoose";
import Coupon from "../models/Coupon.js";

// Apply Coupon
export const applyCoupon = async (req, res) => {
  const { code, userId, orderTotal } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  try {
    const coupons = await Coupon.findOne({ code: code.toUpperCase() });


    if (!coupons) return res.status(404).json({ success: false, message: "Coupon is invalid" });

    if (coupons.expiryDate) {
      const expiry = new Date(coupons.expiryDate);
      if (isNaN(expiry.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid coupon expiry date" });
      }

      if (new Date() > expiry) {
        return res.status(400).json({ success: false, message: "Coupon expired" });
      }
    }


    if (orderTotal < coupons.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value is ₹${coupons.minOrderAmount}`,
      });
    }
    let discount = coupons.discountType === "percentage"
      ? (coupons.discountValue / 100) * orderTotal
      : coupons.discountValue;

    return res.status(200).json({
      success: true,
      message: "Coupon applied",
      discount: Math.min(discount, orderTotal),
      finalAmount: orderTotal - discount
    });


  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Mark Coupon as Used (after order placed)
export const markCouponUsed = async (req, res) => {
  const { userId, code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    if (!coupon.usedBy.includes(userId)) {
      coupon.usedBy.push(userId);
      await coupon.save();
    }

    res.status(200).json({ success: true, message: "Coupon usage recorded" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
