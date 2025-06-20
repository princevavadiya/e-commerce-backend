import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import { resetPasswordService, sendResetPasswordLink } from "../middleware/auth.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY)
}


//Route for user login 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    req.body.userId = user._id;

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" })

    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {

      const token = createToken(user._id)

      res.json({ success: true, user: { token, userId: user._id } })
      console.log("userId", req.body);


    }
    else {
      res.json({ success: false, message: "Invalid credentials" })
    }


  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // checking  user already  exists  or not 
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" })
    }
    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" })
    }

    // hasing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    })

    const user = await newUser.save()

    const token = createToken(user._id)
    req.body.userId = user._id;
    res.json({ success: true, user: { token, userId: user._id } })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
// Route for admin login

const adminLogin = async (req, res) => {
  try {

    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET_KEY)
      res.json({ success: true, token })

    } else {
      res.json({ success: false, message: "Invalid cradentials" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })

  }

}
const forgetPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ success: false, message: "email is required" })
  }



  try {
    const response = await sendResetPasswordLink(email)
    if (response.success) {
      return res.status(200).json(response);
    }
    else {
      return res.status(401).json(response)
    }




  } catch (error) {
    console.error("Login error", error)
    return { success: false, message: "Login Failed.Please try again later.", }
  }


}
const resetPassword = async (req, res) => {
  const { token, password } = req.body
  if (!token, !password) {
    return res.status(400).json({ success: false, message: "password is required" })
  }

  try {

    const response = await resetPasswordService(token, password)

    if (response.success) {
      return res.status(200).json(response);
    }
    else {
      return res.status(401).json(response)
    }




  } catch (error) {
    console.error("Login error", error)
    return { success: false, message: "Login Failed.Please try again later.", }
  }

}

export { loginUser, registerUser, adminLogin, forgetPassword, resetPassword }