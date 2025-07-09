import express, { Request, Response } from "express";
import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from "./controllers/batchController";

const router = express.Router();

router.get("/", (req: Request, res: Response) => getBatches(req, res));
router.post("/", (req: Request, res: Response) => createBatch(req, res));
router.put("/:id", (req: Request, res: Response) => updateBatch(req, res));
router.delete("/:id", (req: Request, res: Response) => deleteBatch(req, res));

export default router;
