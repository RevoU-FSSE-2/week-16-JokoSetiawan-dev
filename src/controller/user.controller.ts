import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.connection";

const findAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query("SELECT id, name, role FROM user_table");
    res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User not found",
    });
  }
};

const findUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const getById = await db.query(
      `SELECT
      subquery.id,
      subquery.name,
      subquery.role,
      subquery.target,
      subquery.achievement,
      subquery.achievement - subquery.target AS gap
   FROM (
      SELECT
          ut.id,
          ut.name,
          ut.role,
          ut.target,
          SUM(st.amount) AS achievement
      FROM
          user_table AS ut
      LEFT JOIN
          sellout_table AS st ON ut.id = st.user_id 
      WHERE
          ut.id = ?
      GROUP BY
          ut.id
     ) AS subquery;  
    `,
      id
    );

    res.status(200).json({
      success: true,
      data: getById[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User not found",
    });
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const result: any = await db.query(
      `insert into sellout_tracking.user_table (name, role, target)
      values (?,?,?)`,
      [body.name, body.role, body.target]
    );
    const id = result[0].insertId;
    const getId: any = await db.query(
      `select * from user_table where id =` + id
    );
    console.log(getId);
    res.status(200).json({
      success: true,
      data: getId[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create User Failed",
    });
  }
};

const updateUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const result: any = await db.query(
      `UPDATE sellout_tracking.user_table
         SET name = ?, role = ?, target = ?
         WHERE id = ?`,
      [body.name, body.role, body.target, id]
    );
    console.log(result);
    res.status(200).json({
      id: id,
      data: result[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update User Failed",
    });
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result: any = await db.query(
      `delete from sellout_tracking.user_table where id = ?`,
      id
    );

    res.status(200).json({
      id: id,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete User Failed",
    });
  }
};

const userController = {
  findAllUser,
  findUserId,
  updateUserData,
  createUser,
  deleteUser,
};
export default userController;
