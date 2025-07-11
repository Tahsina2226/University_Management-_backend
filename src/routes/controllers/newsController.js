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
exports.createNews = exports.getNews = void 0;
const db_1 = __importDefault(require("../../db"));
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query("SELECT * FROM news");
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getNews = getNews;
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, date } = req.body;
    try {
        const result = yield db_1.default.query("INSERT INTO news (title, content, date) VALUES ($1, $2, $3) RETURNING *", [title, content, date]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createNews = createNews;
