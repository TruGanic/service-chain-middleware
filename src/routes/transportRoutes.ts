import { Router } from 'express';
import { confirmPickup, completeTrip, getBatch } from '../controllers/transportController';
import { authenticateSupabase } from '../middleware/auth';
import { authorizeOrg } from '../middleware/authorizeOrg';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// POST http://localhost:3000/api/transport/pickup
router.post('/pickup', authenticateSupabase, upload.single('invoice'), confirmPickup);

// POST http://localhost:3000/api/transport/complete-trip
router.post('/complete-trip', authenticateSupabase, completeTrip);

// GET http://localhost:3000/api/transport/batch/BATCH_001
router.get('/batch/:id', authenticateSupabase, getBatch);

export default router;