import { Router } from 'express';
import { applyOwn } from '../controllers/student/application';
import * as reportController from "../controllers/student/report";
const router = Router();

router.post('/applyOwn', applyOwn);
router.post("/report/submit", reportController.submitReport);

export default router;
