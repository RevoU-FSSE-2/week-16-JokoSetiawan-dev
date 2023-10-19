import express from "express";
const resetPasswordRoutes = express.Router();
import resetPassword from "../controller/resetPassword.controller";

resetPasswordRoutes.post('/resetrequest', resetPassword.resetPasswordReq)
resetPasswordRoutes.post('/resetpassword', resetPassword.reset)

export default resetPasswordRoutes
