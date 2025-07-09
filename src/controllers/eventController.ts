import { Request, Response } from "express";
import pool from "../db";

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM events");
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, details, date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO events (title, details, date) VALUES ($1, $2, $3) RETURNING *",
      [title, details, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
