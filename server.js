const express = require('express');
const cors = require('cors');
require('dotenv').config();

const batchRoutes = require('./routes/batchRoutes');
const routineRoutes = require('./routes/routineRoutes');
const eventRoutes = require('./routes/eventRoutes');
const newsRoutes = require('./routes/newsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/batches', batchRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
    res.send('University Management API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
