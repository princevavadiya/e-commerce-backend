import express from "express";
import { applyCoupon, markCouponUsed } from "../controllers/cuponeController.js";

const couponRoutes = express.Router();

couponRoutes.post("/apply", applyCoupon);         // POST /api/coupon/apply
couponRoutes.post("/mark-used", markCouponUsed);  // POST /api/coupon/mark-used

export default couponRoutes;
