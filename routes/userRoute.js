import express from "express";
import { registerUser, loginUser, adminLogin, forgetPassword, resetPassword } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post("/admin", adminLogin)
userRouter.post("/forget-password", forgetPassword)
userRouter.post("/reset-password", resetPassword)

export default userRouter;
