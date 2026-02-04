"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transportController_1 = require("../controllers/transportController");
const router = (0, express_1.Router)();
// POST http://localhost:3000/api/transport/pickup
router.post('/pickup', transportController_1.confirmPickup);
// POST http://localhost:3000/api/transport/complete-trip
router.post('/complete-trip', transportController_1.completeTrip);
// GET http://localhost:3000/api/transport/batch/BATCH_001
router.get('/batch/:id', transportController_1.getBatch);
exports.default = router;
