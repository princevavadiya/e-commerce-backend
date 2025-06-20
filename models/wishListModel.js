import mongoose from "mongoose";


const WishListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"

    }
  ]



}, { minimize: false })

const wishListModel = mongoose.model('WishList', WishListSchema);


export default wishListModel