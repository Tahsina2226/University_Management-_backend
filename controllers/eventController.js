const pool = require('../db');

exports.getEvents = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createEvent = async (req, res) => {
    const { title, details, date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO events (title, details, date) VALUES ($1, $2, $3) RETURNING *',
            [title, details, date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
