import express from "express";
import {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from "../controllers/routineController";

const router = express.Router();

router.get("/", getRoutines);
router.post("/", createRoutine);
router.put("/:id", updateRoutine);
router.delete("/:id", deleteRoutine);

export default router;
