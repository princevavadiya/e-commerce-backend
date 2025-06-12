import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartrouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import bodyParser from "body-parser";
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

app.get("/", (req, res) => {
  res.send("Hello World");
})
app.get("/hello", (req, res) => {
  res.json({ message: "hello World" });
})
app.use(cors());
app.use(bodyParser.json());
app.post("/send-mail", async (req, res) => {
  const { email } = req.body;

  // Setup transporter (using Gmail for example)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vavadiyaprince999@gmail.com",
      pass: "vuoufkeigmehktxq", 
    },
  });

  const mailOptions = {
    from: email,
    to: "vavadiyaprince999@gmail.com", 
    subject: "I Will Connect you from Work.",

  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Mail sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Mail sending failed." });
  }
});


app.listen(port, () => {
  console.log("http://localhost:5000");
})


