import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import batchRoutes from "./routes/batchRoutes";
import routineRoutes from "./routes/routineRoutes";
import eventRoutes from "./routes/eventRoutes";
import newsRoutes from "./routes/newsRoutes";
import enrollRoutes from "./routes/enrollRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export interface JwtPayload {
  email: string;
  role: string;
}

export const authenticateToken = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
    req.user = user as JwtPayload;
    next();
  });
};

export const authorizeAdmin = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }
  next();
};

// In-memory users (তুমি চাইলে DB তেও রাখতে পারো)
const users = [
  {
    email: "admin@university.com",
    password: "password123",
    role: "admin",
  },
  {
    email: "user@university.com",
    password: "userpass",
    role: "user",
  },
];

// ইন-মেমোরি enrollments (তুমি চাইলে DB তেও রাখতে পারো)
interface Enrollment {
  userEmail: string;
  batchId: number;
  batchDepartment: string;
}
const enrollments: Enrollment[] = [];

// --- AUTH ROUTES ---

app.post("/api/admin/register", (req: Request, res: Response): void => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    res.status(409).json({ message: "User already exists" });
    return;
  }
  users.push({ email, password, role });
  const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: "1h" });
  res.status(201).json({ token, role });
});

app.post("/api/admin/login", (req: Request, res: Response): void => {
  const { email, password } = req.body;
  const foundUser = users.find(
    (u) => u.email === email && u.password === password
  );
  if (!foundUser) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  const token = jwt.sign(
    { email: foundUser.email, role: foundUser.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token, role: foundUser.role });
});

// --- ROUTES WITH AUTHENTICATION ---

// Add authenticateToken middleware here for routineRoutes
app.use("/api/routines", authenticateToken, routineRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/batches", authenticateToken, batchRoutes);
app.use("/api/enroll", authenticateToken, enrollRoutes);

app.post(
  "/api/enroll",
  authenticateToken,
  (req: Request & { user?: JwtPayload }, res: Response): void => {
    const userEmail = req.user?.email;
    const { batchId, batchDepartment } = req.body;

    if (!userEmail || !batchId || !batchDepartment) {
      res.status(400).json({ message: "Missing enrollment data" });
      return;
    }

    const existingEnrollment = enrollments.find(
      (e) => e.userEmail === userEmail
    );
    if (existingEnrollment) {
      if (existingEnrollment.batchDepartment !== batchDepartment) {
        res.status(400).json({
          message: `Already enrolled in department "${existingEnrollment.batchDepartment}". Cannot enroll in another.`,
        });
        return;
      } else {
        res.status(400).json({
          message: `Already enrolled in this batch.`,
        });
        return;
      }
    }

    enrollments.push({ userEmail, batchId, batchDepartment });
    res.json({ message: "Enrollment successful" });
  }
);

app.get(
  "/api/enroll/:email",
  authenticateToken,
  (req: Request & { user?: JwtPayload }, res: Response): void => {
    const email = req.params.email;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const enrollment = enrollments.find((e) => e.userEmail === email);
    if (!enrollment) {
      res.status(404).json({ message: "No enrollment found for user" });
      return;
    }

    res.json(enrollment);
  }
);

app.get("/", (_req: Request, res: Response): void => {
  res.send("University Management API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
