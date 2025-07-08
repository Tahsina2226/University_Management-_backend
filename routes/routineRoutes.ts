import express from 'express';
import { getRoutines, createRoutine } from '../controllers/routineController';

const router = express.Router();

router.get('/', getRoutines);
router.post('/', createRoutine);

export default router;
