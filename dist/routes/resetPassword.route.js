"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resetPasswordRoutes = express_1.default.Router();
const resetPassword_controller_1 = __importDefault(require("../controller/resetPassword.controller"));
resetPasswordRoutes.post('/resetrequest', resetPassword_controller_1.default.resetPasswordReq);
resetPasswordRoutes.post('/resetpassword', resetPassword_controller_1.default.reset);
exports.default = resetPasswordRoutes;
