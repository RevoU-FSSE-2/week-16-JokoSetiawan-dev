import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY || "default-secret-key";

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

    const id = 123; // Replace with the actual user ID from the database

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

    // Retrieve the user from the database by username
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

    const token = jwt.sign(
      { id: userData.id, username: userData.username, role: userData.role },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

const authController = { userRegister, loginUser };
export default authController;
