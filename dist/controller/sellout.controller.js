"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = require("../config/db.connection");
const findAllSellout = async (req, res, next) => {
    try {
        const result = await db_connection_1.db.query("SELECT * FROM sellout_table");
        res.status(200).json({
            success: true,
            data: result[0]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Sellout Undetected"
        });
    }
};
const findSelloutId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const getById = await db_connection_1.db.query(`SELECT 
      st.id,
      st.user_id,
      st.sku,
      st.quantity,
      st.amount
  FROM
      sellout_table AS st
  WHERE
      st.user_id = ?
  GROUP BY
      st.id, st.user_id, st.sku, st.quantity, st.amount;  
    `, id);
        res.status(200).json({
            success: true,
            data: getById[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Sellout Undetected",
        });
    }
};
const inputSellout = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await db_connection_1.db.query(`insert into sellout_tracking.sellout_table (user_id, sku, quantity, amount)
      values (?,?,?,?)`, [body.user_id, body.sku, body.quantity, body.amount]);
        const id = result[0].insertId;
        const getId = await db_connection_1.db.query(`select * from sellout_table where id =` + id);
        console.log(getId);
        res.status(200).json({
            success: true,
            data: getId[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Input Sellout Failed",
        });
    }
};
const updateSelloutData = async (req, res, next) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const result = await db_connection_1.db.query(`UPDATE sellout_tracking.sellout_table
           SET user_id = ?, sku = ?, quantity = ?, amount = ?
           WHERE id = ?`, [body.user_id, body.sku, body.quantity, body.amount, id]);
        console.log(result);
        res.status(200).json({
            id: id,
            data: result[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Update sellout Failed",
        });
    }
};
const deleteSellout = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await db_connection_1.db.query(`delete from sellout_tracking.sellout_table where id = ?`, id);
        res.status(200).json({
            id: id,
            message: "Sellout deleted",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete Sellout Failed",
        });
    }
};
const selloutController = { findAllSellout, findSelloutId, inputSellout, updateSelloutData, deleteSellout };
exports.default = selloutController;
