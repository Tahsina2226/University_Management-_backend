const pool = require('../db');

exports.getNews = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM news');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createNews = async (req, res) => {
    const { title, content, date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO news (title, content, date) VALUES ($1, $2, $3) RETURNING *',
            [title, content, date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
