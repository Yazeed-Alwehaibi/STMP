import { Router } from "express";
import { createOffer } from "../controllers/rep/offers";
import { fetchRepOffers, fetchOfferParticipants, acceptParticipant, rejectParticipant} from "../controllers/rep/application";
const router = Router();

router.post("/offers", createOffer);

router.get("/fetchRepOffers", fetchRepOffers); // ?repID=
router.get("/fetchOfferParticipants", fetchOfferParticipants); // ?offerID=

router.post("/acceptParticipant", acceptParticipant);
router.post("/rejectParticipant", rejectParticipant);


export default router;
