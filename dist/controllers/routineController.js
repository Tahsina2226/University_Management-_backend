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
exports.deleteRoutine = exports.updateRoutine = exports.createRoutine = exports.getRoutines = void 0;
const db_1 = __importDefault(require("../db"));
const getRoutines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const department = req.query.department;
    try {
        let result;
        if (department) {
            result = yield db_1.default.query(`SELECT r.* FROM routines r
         JOIN batches b ON r.batch_id = b.id
         WHERE b.department = $1
         ORDER BY r.id DESC`, [department]);
        }
        else {
            result = yield db_1.default.query("SELECT * FROM routines ORDER BY id DESC");
        }
        res.json(result.rows);
    }
    catch (err) {
        console.error("getRoutines error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
exports.getRoutines = getRoutines;
const createRoutine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_name, day, time, room, batch_id } = req.body;
    try {
        const result = yield db_1.default.query("INSERT INTO routines (course_name, day, time, room, batch_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", [course_name, day, time, room, batch_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error("createRoutine error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
exports.createRoutine = createRoutine;
const updateRoutine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { course_name, day, time, room, batch_id } = req.body;
    try {
        const result = yield db_1.default.query("UPDATE routines SET course_name=$1, day=$2, time=$3, room=$4, batch_id=$5 WHERE id=$6 RETURNING *", [course_name, day, time, room, batch_id, id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Routine not found" });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error("updateRoutine error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
exports.updateRoutine = updateRoutine;
const deleteRoutine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query("DELETE FROM routines WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: "Routine not found" });
            return;
        }
        res.json({ message: "Routine deleted successfully" });
    }
    catch (err) {
        console.error("deleteRoutine error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
exports.deleteRoutine = deleteRoutine;
