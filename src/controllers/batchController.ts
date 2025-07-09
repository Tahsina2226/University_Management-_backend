import { Request, Response } from "express";
import pool from "../db";

export const getBatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM batches");
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createBatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, department, semester } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO batches (name, department, semester) VALUES ($1, $2, $3) RETURNING *",
      [name, department, semester]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, department, semester } = req.body;
  try {
    const result = await pool.query(
      "UPDATE batches SET name = $1, department = $2, semester = $3 WHERE id = $4 RETURNING *",
      [name, department, semester, id]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM batches WHERE id = $1", [id]);
    res.json({ message: "Batch deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
