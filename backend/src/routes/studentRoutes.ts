import { Router } from 'express';
import { applyOwn } from '../controllers/student/application';
import { submitReport } from '../controllers/student/report';
import  {submitPresentation} from "../controllers/student/presentation";
import { matchVenues } from '../controllers/student/suggestion';
import { applyForVenue } from '../controllers/student/suggest';
import { getActiveOffers } from '../controllers/student/offer';
import { applyToOffer } from '../controllers/student/offer';
import { authenticateUser } from "../middleware/auth"; 


const router = Router();


router.post('/applyOwn', authenticateUser, applyOwn);

router.post("/report/submit", authenticateUser, submitReport);

router.post("/presentation/submit", authenticateUser, submitPresentation);

router.post("/match-venues", authenticateUser, matchVenues);

router.post("/apply-suggest", authenticateUser, applyForVenue);

router.get("/fetchOffers", getActiveOffers);

router.post("/applyToOffer", authenticateUser, applyToOffer);


export default router;
