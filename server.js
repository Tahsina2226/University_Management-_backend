const express = require('express');
const cors = require('cors');
require('dotenv').config();

const batchRoutes = require('./routes/batchRoutes');
const routineRoutes = require('./routes/batchRoutes');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/batches', batchRoutes);
app.use('/api/routines', routineRoutes);


app.get('/', (req, res) => {
    res.send('University Management API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
