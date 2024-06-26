"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
authRoutes.post('/register', auth_controller_1.default.userRegister);
authRoutes.post('/login', auth_controller_1.default.loginUser);
authRoutes.get('/logout', auth_controller_1.default.logoutUser);
exports.default = authRoutes;
