import express from "express";
import { listProducts, addProduct, removeProducts, singleProduct, postProductWishList, getProductWishList, getFilteredProducts, deleteProductWishList } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { authUser } from "../middleware/auth.js";


const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct)
productRouter.delete("/remove/:id", adminAuth, removeProducts)
productRouter.post("/single", singleProduct)
productRouter.get("/list", listProducts)
productRouter.get("/wishlist", authUser, getProductWishList)
productRouter.post("/wishlist/:productId", authUser, postProductWishList)
productRouter.delete("/wishlist/remove/:productId", deleteProductWishList);

productRouter.get("/lists",getFilteredProducts)
export default productRouter