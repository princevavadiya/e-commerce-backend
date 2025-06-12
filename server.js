import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartrouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
// config
const app = express();
const port = process.env.PORT || 5000;

connectDB();
connectCloudinary();
// middleware

app.use(express.json());
app.use(cors());
// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartrouter)
app.use('/api/order', orderRouter)


// api endpoints 

app.get("/hello", (req, res) => {
  res.json({message: "hello World"});
})

app.listen(port, () => {
  console.log("http://localhost:5000");
})


