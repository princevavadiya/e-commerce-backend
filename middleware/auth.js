import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
const resertToken = 'jejdxdbddhjbjhhbjyuv45'
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const authUser = async (req, res, next) => {

  const { token } = req.headers
  if (!token) {
    return res.json({ success: false, message: 'Not Authorized Login Again' });
  }
  try {

    const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.userId = token_decode.id;

    next();


  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });



  }
}



const sendResetPasswordLink = async (email) => {
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      resertToken,
      { expiresIn: '10m' }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vavadiyaprince999@gmail.com",
        pass: "vuoufkeigmehktxq"
      }
    })


    const resetLink = `https://ecommerce-frontend-gbo64523z-princevavadiyas-projects.vercel.app/reset-password?token=${resetToken}`;
    const mailoptions = {
      from: "vavadiyaprince999@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Click the Link to reset your Password: ${resetLink}`
    }
    await transporter.sendMail(mailoptions)

    return {
      success: true,
      message: "Reset password email sent successfully",
      resetLink, // Optional: useful for testing
    };

  } catch (error) {
    console.log("Error:", error);
    return { success: false, message: "Login Failed.Please try again later." };
  }
};
const resetPasswordService = async (token, password) => {
  try {
    const decoded = jwt.verify(token, resertToken);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword }, { new: true });
    if (!result) {
      return { success: false, message: "User not found or Update failed" };
    }
    return { success: true, message: "Password Reset Successfully" };

  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Login Failed.Please try again later." };



  }
}



export { authUser, sendResetPasswordLink, resetPasswordService } 