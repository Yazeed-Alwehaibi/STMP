import express from "express";
import { addUser, getUsers } from "../controllers/userController";
import { getProfile } from "../controllers/userController";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

router.get("/add/:userid/:name/:email/:role/:department/:extrainfo/:password/:status", addUser);
router.get("/all", getUsers);


router.post("/register", addUser);

router.get("/profile", authenticateUser, getProfile);


export default router;
