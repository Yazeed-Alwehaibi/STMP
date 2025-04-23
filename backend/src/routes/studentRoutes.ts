import { Router } from 'express';
import { applyOwn } from '../controllers/student/application';
import { submitReport } from '../controllers/student/report';
import  {submitPresentation} from "../controllers/student/presentation";
import { matchVenues } from '../controllers/student/suggestion';
import { applyForVenue } from '../controllers/student/suggest';


const router = Router();

router.post('/applyOwn', applyOwn);

router.post("/report/submit", submitReport);

router.post("/presentation/submit", submitPresentation);

router.post("/match-venues", matchVenues);

router.post("/apply-suggest", applyForVenue);



export default router;
