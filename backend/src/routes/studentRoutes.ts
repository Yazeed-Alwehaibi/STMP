import { Router } from 'express';
import { applyOwn } from '../controllers/student/application';
import * as reportController from "../controllers/student/report";
import * as presentationController from "../controllers/student/presentation";


const router = Router();

router.post('/applyOwn', applyOwn);

router.post("/report/submit", reportController.submitReport);

router.post("/presentation/submit", presentationController.submitPresentation);


export default router;
