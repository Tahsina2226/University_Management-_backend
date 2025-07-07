const pool = require('../db');

exports.getRoutines = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM routines');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createRoutine = async (req, res) => {
    const { course, time, room, batch_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO routines (course, time, room, batch_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [course, time, room, batch_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
