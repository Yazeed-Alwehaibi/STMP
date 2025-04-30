import { Router } from "express";
import { createOffer } from "../controllers/rep/offers";
import { fetchRepOffers, fetchOfferParticipants, acceptParticipant, rejectParticipant} from "../controllers/rep/application";
import { authenticateUser } from "../middleware/auth"; 

const router = Router();

router.post("/offers", authenticateUser, createOffer);

router.get("/fetchRepOffers", authenticateUser, fetchRepOffers); // ?repID=
router.get("/fetchOfferParticipants", authenticateUser, fetchOfferParticipants); // ?offerID=

router.post("/acceptParticipant", authenticateUser, acceptParticipant);
router.post("/rejectParticipant", authenticateUser, rejectParticipant);


export default router;
