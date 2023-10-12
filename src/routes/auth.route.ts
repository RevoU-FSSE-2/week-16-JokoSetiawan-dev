import express from "express";
const authRoutes = express.Router();
import authController from "../controller/auth.controller";

authRoutes.post('/register', authController.userRegister)
authRoutes.post('/login', authController.loginUser)

export default authRoutes