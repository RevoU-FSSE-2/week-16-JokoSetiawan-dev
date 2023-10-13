"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = require("../config/db.connection");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY || "default-secret-key";
const refreshSecretKey = process.env.REFRESH_KEY || "default-refresh-key";
const userRegister = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Username, password, and role are required fields",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const insertResult = await db_connection_1.db.query(`INSERT INTO sellout_tracking.auth_table (username, password, role)
      VALUES (?, ?, ?)`, [username, hashedPassword, role]);
        const id = 123;
        const token = jsonwebtoken_1.default.sign({ id, username, role }, secretKey, {
            expiresIn: "1h",
        });
        res.status(200).json({
            success: true,
            message: "Registration successful"
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "Create User Failed",
        });
    }
};
const loginAttempts = new Map();
const maxLoginAttempts = 5;
const lockoutDuration = 15 * 60 * 1000;
const loginUser = async (req, res, next) => {
    try {
        const { password, username } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required fields',
            });
        }
        if (loginAttempts.has(username) && loginAttempts.get(username) >= maxLoginAttempts) {
            return res.status(429).json({
                success: false,
                message: 'Too many login attempts. Please try again later.',
            });
        }
        const getUserQuery = `SELECT * FROM sellout_tracking.auth_table WHERE username = '${username}'`;
        const [queryResult] = await db_connection_1.db.query(getUserQuery);
        if (queryResult.length === 0) {
            const attempts = loginAttempts.get(username) || 0;
            loginAttempts.set(username, attempts + 1);
            setTimeout(() => {
                loginAttempts.delete(username);
            }, lockoutDuration);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password',
            });
        }
        const userData = queryResult[0];
        const isPasswordValid = await bcrypt_1.default.compare(password, userData.password);
        if (!isPasswordValid) {
            const attempts = loginAttempts.get(username) || 0;
            loginAttempts.set(username, attempts + 1);
            setTimeout(() => {
                loginAttempts.delete(username);
            }, lockoutDuration);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password',
            });
        }
        loginAttempts.delete(username);
        const accessToken = jsonwebtoken_1.default.sign({ id: userData.id, username: userData.username, role: userData.role }, secretKey, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: userData.id }, refreshSecretKey, { expiresIn: '7d' });
        res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({
            success: true,
            message: 'Login successful',
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
const logoutUser = (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ success: true, message: 'Logged out successfully' });
};
const authController = { userRegister, loginUser, logoutUser };
exports.default = authController;
