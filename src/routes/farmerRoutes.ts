import { Router } from 'express';
import { createHarvestRecord } from '../controllers/farmerController';
import { authenticateSupabase } from '../middleware/auth';

const router = Router();

// Endpoint: POST /api/farmer/harvest
router.post('/harvest', authenticateSupabase,createHarvestRecord);

export default router;