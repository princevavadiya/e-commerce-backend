import express from "express";
import { registerUser, loginUser, adminLogin, forgetPassword, resetPassword } from "../controllers/userController.js";
import { authUser } from "../middleware/auth.js";

const userRouter = express.Router();
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post("/admin", adminLogin)
userRouter.post("/forget-password", authUser, forgetPassword)
userRouter.post("/reset-password", authUser, resetPassword)

export default userRouter;
