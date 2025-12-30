import { Router } from 'express';
import { confirmPickup, completeTrip, getBatch } from '../controllers/transportController';

const router = Router();

// POST http://localhost:3000/api/transport/pickup
router.post('/pickup', confirmPickup);

// POST http://localhost:3000/api/transport/complete-trip
router.post('/complete-trip', completeTrip);

// GET http://localhost:3000/api/transport/batch/BATCH_001
router.get('/batch/:id', getBatch);

export default router;