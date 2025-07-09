import { Request, Response } from "express";
import pool from "../db";

export const getNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM news");
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createNews = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, content, date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO news (title, content, date) VALUES ($1, $2, $3) RETURNING *",
      [title, content, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
