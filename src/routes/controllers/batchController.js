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
exports.deleteBatch = exports.updateBatch = exports.createBatch = exports.getBatches = void 0;
const db_1 = __importDefault(require("../../db"));
const getBatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query("SELECT * FROM batches");
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getBatches = getBatches;
const createBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, department, semester } = req.body;
    try {
        const result = yield db_1.default.query("INSERT INTO batches (name, department, semester) VALUES ($1, $2, $3) RETURNING *", [name, department, semester]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createBatch = createBatch;
const updateBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, department, semester } = req.body;
    try {
        const result = yield db_1.default.query("UPDATE batches SET name = $1, department = $2, semester = $3 WHERE id = $4 RETURNING *", [name, department, semester, id]);
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateBatch = updateBatch;
const deleteBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.query("DELETE FROM batches WHERE id = $1", [id]);
        res.json({ message: "Batch deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteBatch = deleteBatch;
