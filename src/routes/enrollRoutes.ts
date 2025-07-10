import express from "express";
import { Pool } from "pg";

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function enrollUserHandler(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { email, batchId } = req.body;

  // Validate input
  if (!email || !batchId) {
    res.status(400).json({ message: "Missing email or batch ID" });
    return;
  }

  try {
    // Optional: check if batchId exists in batches table
    const batchCheck = await pool.query(
      "SELECT id FROM batches WHERE id = $1",
      [batchId]
    );
    if (batchCheck.rowCount === 0) {
      res.status(404).json({ message: "Batch not found" });
      return;
    }

    // Check if user already enrolled
    const existing = await pool.query(
      "SELECT * FROM enrollments WHERE user_email = $1 AND batch_id = $2",
      [email, batchId]
    );

    if (existing.rows.length > 0) {
      res.status(409).json({ message: "Already enrolled" });
      return;
    }

    // Insert enrollment record
    await pool.query(
      "INSERT INTO enrollments (user_email, batch_id) VALUES ($1, $2)",
      [email, batchId]
    );

    res.status(201).json({ message: "Enrolled successfully" });
  } catch (error: any) {
    console.error("Enroll error:", error);
    res.status(500).json({ message: "Error enrolling", error: error.message });
  }
}

router.post("/", enrollUserHandler);

export default router;
