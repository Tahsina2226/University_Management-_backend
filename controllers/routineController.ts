import { Request, Response } from 'express';
import pool from '../db';

export const getRoutines = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM routines');
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createRoutine = async (req: Request, res: Response): Promise<void> => {
    const { course, time, room, batch_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO routines (course, time, room, batch_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [course, time, room, batch_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
