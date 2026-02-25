import { Router } from 'express';
import { getBatchHistory } from '../controllers/retailerController';


const router = Router();

router.get('/history/:id', getBatchHistory);

export default router;