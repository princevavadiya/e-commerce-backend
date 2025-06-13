import express from "express";
import { addToCart, updateCart, getUserCart } from "../controllers/cartController.js";
import {authUser} from "../middleware/auth.js";


const cartrouter = express.Router();


cartrouter.post('/get',authUser,getUserCart)
cartrouter.post('/add',authUser,addToCart)
cartrouter.post('/update',authUser,updateCart)
export default cartrouter;
