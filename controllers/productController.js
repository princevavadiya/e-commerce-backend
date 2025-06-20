import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import wishListModel from "../models/wishListModel.js";

//function for add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body

    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]

    const images = [image1, image2, image3, image4].filter((item) => item != undefined)

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url
      })
    )
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imageUrl,
      date: Date.now()
    }
    const product = new productModel(productData);
    await product.save()

    res.json({ success: true, message: "Product Added" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}


//function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({})
    res.json({ success: true, products })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}
//function for removing product 
const removeProducts = async (req, res) => {
  try {
    console.log(req.params.id);

    await productModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "product Removed" })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }

}
//function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId)
    res.json({ success: true, product })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}
const postProductWishList = async (req, res) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;

    const wishList = await wishListModel.findOne({
      userId,
    })

    if (wishList) {
      const product = wishList.product.includes(productId);
      console.log(product)


      if (product) {
        return res.status(409).json({ success: false, message: "Wishlist already exists" })


      }
      else {
        wishList.product.push(productId);
        const updatedWishList = await wishList.save();
        return res.status(200).json({ success: true, wishList: updatedWishList });


      }
    }
    else {
      const newWishList = new wishListModel({
        userId,
        product: [productId]
      })
      const ADDWishList = await newWishList.save()
      res.status(200).json({ success: true, ADDWishList })

    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}
const getProductWishList = async (req, res) => {
  try {

    const userId = req.query.userId;
    console.log(userId, "::::userId")
    if (!userId) {
      return res.status(401).json({ success: false, message: "" })
    }
    console.log("userId", userId);
    const productwish = await wishListModel.find({
      userId
    })
      .populate({
        path: "product",
        model: "product",
      })

    res.json({ success: true, productwish })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}


const deleteProductWishList = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;


    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const wishList = await wishListModel.findOne({ userId });

    if (!wishList) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    const index = wishList.product.indexOf(productId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not in wishlist" });
    }

    wishList.product.splice(index, 1);
    const updatedWishList = await wishList.save();

    res.status(200).json({ success: true, wishList: updatedWishList });
  } catch (error) {
    console.error("Delete wishlist error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




// subCategory

const getFilteredProducts = async (req, res) => {
  try {
    const { categories = [], types = [], sort, page = 1, limit = 12 } = req.query;



    const query = {};

    if (categories.length > 0) {
      query.category = { $in: Array.isArray(categories) ? categories : [categories] };
    }

    if (types.length > 0) {
      query.subCategory = { $in: Array.isArray(types) ? types : [types] };
    }

    let sortOption = {};
    if (sort === "low-high") sortOption.price = 1;
    else if (sort === "high-low") sortOption.price = -1;

    const skip = (page - 1) * limit;

    const total = await productModel.countDocuments(query);
    const products = await productModel.find(query)
      .sort(sortOption)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json({
      success: true,
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export { addProduct, listProducts, removeProducts, singleProduct, postProductWishList, getProductWishList, getFilteredProducts, deleteProductWishList }