import { Router } from 'express';
import { testConnection } from '../controllers/testController';
const router = Router();

router.get('/', testConnection);

export default router;