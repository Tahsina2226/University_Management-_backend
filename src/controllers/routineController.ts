import { Request, Response } from "express";
import pool from "../db";

// ✅ Get All Routines
export const getRoutines = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM routines ORDER BY id DESC");
    res.json(result.rows);
  } catch (err: any) {
    console.error("getRoutines error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create Routine
export const createRoutine = async (req: Request, res: Response) => {
  const { course_name, day, time, room, batch_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO routines (course_name, day, time, room, batch_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [course_name, day, time, room, batch_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("createRoutine error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Routine
export const updateRoutine = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { course_name, day, time, room, batch_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE routines SET course_name = $1, day = $2, time = $3, room = $4, batch_id = $5 WHERE id = $6 RETURNING *",
      [course_name, day, time, room, batch_id, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Routine not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("updateRoutine error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Routine
export const deleteRoutine = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM routines WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Routine not found" });
      return;
    }
    res.json({ message: "Routine deleted successfully" });
  } catch (err: any) {
    console.error("deleteRoutine error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
