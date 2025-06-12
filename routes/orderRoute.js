import express from "express";
import { placeOrder, userOrders, placeOrderRazorpay, placeOrderStripe, allOrders, updateStatus, verifyStripe } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";


const orderRouter = express.Router();


// admin auth
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status/', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)


// User Feture
orderRouter.post('/userorders', authUser, userOrders)
// verfiy payment 
orderRouter.post("/verifyStripe", authUser,verifyStripe)

export default orderRouter;
