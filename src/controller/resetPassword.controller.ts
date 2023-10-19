import { Request, Response } from 'express';
import { db } from "../config/db.connection";
import jwt from 'jsonwebtoken';
import { error } from 'express-openapi-validator';
import bcrypt from "bcrypt";

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY || 'default-secret-key';

const resetPasswordReq = async (req: Request, res: Response) => {
    try {
      const { username } = req.body;
      const [user] = await db.query(`SELECT * FROM auth_table WHERE username = ?`, username);
  
      if (user) {
        const resetToken = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });
        res.json({ resetToken });
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred.' });
    }
  };

  interface JwtPayload {
    username: string;
  }
  
  const reset = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
  
      try {
        const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
        const username = decodedToken.username;
        console.log(decodedToken);
        
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updatePassword = await db.query(`UPDATE auth_table SET password = '${hashedPassword}' WHERE username = '${username}'`, [hashedPassword, username]);
  
        res.json({ message: 'Password reset successful' });
        console.log(updatePassword);
        
      } catch (jwtError) {
        res.status(400).json({ error: 'Invalid or expired token.' });
        console.log(error);
        
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred.' });
    }
  };
  

const resetPassword = {resetPasswordReq, reset}
export default resetPassword
  

