import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Pool } from "pg";

import batchRoutes from "./routes/batchRoutes";
import routineRoutes from "./routes/routineRoutes";
import eventRoutes from "./routes/eventRoutes";
import newsRoutes from "./routes/newsRoutes";
import enrollRoutes from "./routes/enrollRoutes";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export interface JwtPayload {
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admins only" });
    return;
  }
  next();
};

app.post("/api/admin/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, password, role]
    );

    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, role });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/admin/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const user = result.rows[0];
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, role: user.role });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use("/api/routines", authenticateToken, routineRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/batches", authenticateToken, batchRoutes);
app.use("/api/enroll", authenticateToken, enrollRoutes);

app.post(
  "/api/enroll",
  authenticateToken,
  async (req: Request, res: Response) => {
    const userEmail = req.user?.email;
    const { batchId, batchDepartment } = req.body;

    if (!userEmail || !batchId || !batchDepartment) {
      res.status(400).json({ message: "Missing enrollment data" });
      return;
    }

    try {
      const existingEnrollment = await pool.query(
        "SELECT * FROM enrollments WHERE user_email = $1",
        [userEmail]
      );

      if (existingEnrollment.rows.length > 0) {
        const enrollment = existingEnrollment.rows[0];
        if (enrollment.batch_department !== batchDepartment) {
          res.status(400).json({
            message: `Already enrolled in department "${enrollment.batch_department}". Cannot enroll in another.`,
          });
          return;
        }
        res.status(400).json({ message: "Already enrolled in this batch" });
        return;
      }

      await pool.query(
        "INSERT INTO enrollments (user_email, batch_id, batch_department) VALUES ($1, $2, $3)",
        [userEmail, batchId, batchDepartment]
      );

      res.json({ message: "Enrollment successful" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get(
  "/api/enroll/:email",
  authenticateToken,
  async (req: Request, res: Response) => {
    const email = req.params.email;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    try {
      const result = await pool.query(
        "SELECT * FROM enrollments WHERE user_email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ message: "No enrollment found for user" });
        return;
      }

      res.json(result.rows[0]);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "OK",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({
      status: "DOWN",
      database: "disconnected",
      error: err.message,
    });
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.send("University Management API Running");
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   console.log(`🔗 http://localhost:${PORT}`);
// });

export default app;
