"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routineController_1 = require("../controllers/routineController");
const router = express_1.default.Router();
router.get("/", routineController_1.getRoutines); // এখানে query param অনুযায়ী ফিল্টার হবে
router.post("/", routineController_1.createRoutine);
router.put("/:id", routineController_1.updateRoutine);
router.delete("/:id", routineController_1.deleteRoutine);
exports.default = router;
