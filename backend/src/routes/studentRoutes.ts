import { Router } from 'express';
import { applyOwn } from '../controllers/student/application';
const router = Router();

router.post('/applyOwn', applyOwn);

export default router;
