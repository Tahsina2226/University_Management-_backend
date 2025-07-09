"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const batchController_1 = require("./controllers/batchController");
const router = express_1.default.Router();
router.get("/", (req, res) => (0, batchController_1.getBatches)(req, res));
router.post("/", (req, res) => (0, batchController_1.createBatch)(req, res));
router.put("/:id", (req, res) => (0, batchController_1.updateBatch)(req, res));
router.delete("/:id", (req, res) => (0, batchController_1.deleteBatch)(req, res));
exports.default = router;
