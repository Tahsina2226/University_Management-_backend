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
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const router = express_1.default.Router();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
function enrollUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, batchId } = req.body;
        // Validate input
        if (!email || !batchId) {
            res.status(400).json({ message: "Missing email or batch ID" });
            return;
        }
        try {
            // Optional: check if batchId exists in batches table
            const batchCheck = yield pool.query("SELECT id FROM batches WHERE id = $1", [batchId]);
            if (batchCheck.rowCount === 0) {
                res.status(404).json({ message: "Batch not found" });
                return;
            }
            // Check if user already enrolled
            const existing = yield pool.query("SELECT * FROM enrollments WHERE user_email = $1 AND batch_id = $2", [email, batchId]);
            if (existing.rows.length > 0) {
                res.status(409).json({ message: "Already enrolled" });
                return;
            }
            // Insert enrollment record
            yield pool.query("INSERT INTO enrollments (user_email, batch_id) VALUES ($1, $2)", [email, batchId]);
            res.status(201).json({ message: "Enrolled successfully" });
        }
        catch (error) {
            console.error("Enroll error:", error);
            res.status(500).json({ message: "Error enrolling", error: error.message });
        }
    });
}
router.post("/", enrollUserHandler);
exports.default = router;
