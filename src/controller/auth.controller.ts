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

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, username } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required fields",
      });
    }

    const getUserQuery = `SELECT * FROM sellout_tracking.auth_table WHERE username = '${username}'`;
    const [queryResult]: any = await db.query(getUserQuery);

    if (queryResult.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Extract user data from the query result
    const userData = queryResult[0];

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Create an access token with a short expiration time (e.g., 15 minutes)
    const accessToken = jwt.sign(
      { id: userData.id, username: userData.username, role: userData.role },
      secretKey,
      { expiresIn: '15m' }
    );

    // Create a refresh token with a longer expiration time (e.g., 7 days)
    const refreshToken = jwt.sign(
      { id: userData.id },
      refreshSecretKey,
      { expiresIn: '7d' }
    );

    // Calculate the access token's expiration time in seconds
    const accessTokenExpiresIn = 15 * 60; // 15 minutes in seconds

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

const authController = { userRegister, loginUser };
export default authController;
