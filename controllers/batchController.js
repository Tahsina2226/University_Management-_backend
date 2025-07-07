const pool = require('../db');

exports.getBatches = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM batches');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createBatch = async (req, res) => {
    const { name, department, semester } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO batches (name, department, semester) VALUES ($1, $2, $3) RETURNING *',
            [name, department, semester]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
