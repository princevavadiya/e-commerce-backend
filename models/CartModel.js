import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
  cartData: { type: Object, default: {} },
  email: { type: String, required: true, unique: true },


}, { minimize: false })
const cartModel = mongoose.models.cart || mongoose.model('cart', cartSchema)

export default cartModel