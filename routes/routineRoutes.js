const express = require('express');
const { getRoutines, createRoutine } = require('../controllers/routineController');
const router = express.Router();

router.get('/', getRoutines);
router.post('/', createRoutine);

module.exports = router;
