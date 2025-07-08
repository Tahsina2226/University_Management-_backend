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

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

interface JwtPayload {
  email: string;
  role: string;
}

const authenticateToken = (
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

app.post("/api/admin/register", (req: Request, res: Response) => {
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

app.use("/api/routines", routineRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/batches", authenticateToken, batchRoutes);
app.use("/api/enroll", authenticateToken, enrollRoutes);

app.get("/", (_req: Request, res: Response): void => {
  res.send("University Management API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
