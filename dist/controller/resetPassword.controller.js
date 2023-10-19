"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = require("../config/db.connection");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_openapi_validator_1 = require("express-openapi-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY || 'default-secret-key';
const resetPasswordReq = async (req, res) => {
    try {
        const { username } = req.body;
        const [user] = await db_connection_1.db.query(`SELECT * FROM auth_table WHERE username = ?`, username);
        if (user) {
            const resetToken = jsonwebtoken_1.default.sign({ username: username }, secretKey, { expiresIn: '1h' });
            res.json({ resetToken });
        }
        else {
            res.status(404).json({ error: 'User not found.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
};
const reset = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
            const username = decodedToken.username;
            console.log(decodedToken);
            const hashedPassword = await bcrypt_1.default.hash(newPassword, saltRounds);
            const updatePassword = await db_connection_1.db.query(`UPDATE auth_table SET password = '${hashedPassword}' WHERE username = '${username}'`, [hashedPassword, username]);
            res.json({ message: 'Password reset successful' });
            console.log(updatePassword);
        }
        catch (jwtError) {
            res.status(400).json({ error: 'Invalid or expired token.' });
            console.log(express_openapi_validator_1.error);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
};
const resetPassword = { resetPasswordReq, reset };
exports.default = resetPassword;
