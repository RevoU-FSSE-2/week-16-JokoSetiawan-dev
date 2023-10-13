import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY || "default-secret-key";
const refreshSecretKey = process.env.REFRESH_KEY || "default-refresh-key";

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and role are required fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertResult: any = await db.query(
      `INSERT INTO sellout_tracking.auth_table (username, password, role)
      VALUES (?, ?, ?)`,
      [username, hashedPassword, role]
    );

    const id = 123;

    const token = jwt.sign({ id, username, role }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Registration successful"
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Create User Failed",
    });
  }
};

const loginAttempts = new Map<string, number>();

const maxLoginAttempts = 5;
const lockoutDuration = 15 * 60 * 1000; 

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, username } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required fields',
      });
    }

    if (loginAttempts.has(username) && loginAttempts.get(username)! >= maxLoginAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again later.',
      });
    }

    const getUserQuery = `SELECT * FROM sellout_tracking.auth_table WHERE username = '${username}'`;
    const [queryResult]: any = await db.query(getUserQuery);

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
    const isPasswordValid = await bcrypt.compare(password, userData.password);

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

    const accessToken = jwt.sign(
      { id: userData.id, username: userData.username, role: userData.role },
      secretKey,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: userData.id },
      refreshSecretKey,
      { expiresIn: '7d' }
    );

    res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};


const logoutUser = (req: Request, res: Response) => {

  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  res.json({ success: true, message: 'Logged out successfully' });
};


const authController = { userRegister, loginUser, logoutUser };
export default authController;
