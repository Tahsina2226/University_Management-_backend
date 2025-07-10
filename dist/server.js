"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticateToken = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const batchRoutes_1 = __importDefault(require("./routes/batchRoutes"));
const routineRoutes_1 = __importDefault(require("./routes/routineRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const enrollRoutes_1 = __importDefault(require("./routes/enrollRoutes"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});
pool
    .query("SELECT NOW()")
    .then(() => console.log("✅ PostgreSQL connected"))
    .catch((err) => console.error("❌ PostgreSQL connection error:", err));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://course-event-management.vercel.app",
        "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = user;
        next();
    }
    catch (_a) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
});
exports.authenticateToken = authenticateToken;
const authorizeAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        res.status(403).json({ message: "Admins only" });
        return;
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
app.post("/api/admin/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {
        const userExists = yield pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        yield pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)", [name, email, password, role]);
        const token = jsonwebtoken_1.default.sign({ email, role }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token, role });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post("/api/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const result = yield pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
        if (result.rows.length === 0) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const user = result.rows[0];
        const token = jsonwebtoken_1.default.sign({ email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, role: user.role });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.use("/api/routines", exports.authenticateToken, routineRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
app.use("/api/news", newsRoutes_1.default);
app.use("/api/batches", exports.authenticateToken, batchRoutes_1.default);
app.use("/api/enroll", exports.authenticateToken, enrollRoutes_1.default);
app.post("/api/enroll", exports.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const { batchId, batchDepartment } = req.body;
    if (!userEmail || !batchId || !batchDepartment) {
        res.status(400).json({ message: "Missing enrollment data" });
        return;
    }
    try {
        const existingEnrollment = yield pool.query("SELECT * FROM enrollments WHERE user_email = $1", [userEmail]);
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
        yield pool.query("INSERT INTO enrollments (user_email, batch_id, batch_department) VALUES ($1, $2, $3)", [userEmail, batchId, batchDepartment]);
        res.json({ message: "Enrollment successful" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.get("/api/enroll/:email", exports.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }
    try {
        const result = yield pool.query("SELECT * FROM enrollments WHERE user_email = $1", [email]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No enrollment found for user" });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.get("/health", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query("SELECT 1");
        res.json({
            status: "OK",
            database: "connected",
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        res.status(500).json({
            status: "DOWN",
            database: "disconnected",
            error: err.message,
        });
    }
}));
app.get("/", (_req, res) => {
    res.send("University Management API Running");
});
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
});
exports.default = app;
