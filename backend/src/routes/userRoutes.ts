import express from "express";
import { addUser, getUsers } from "../controllers/userController";

const router = express.Router();

router.get("/add/:userid/:name/:email/:role/:department/:extrainfo/:password/:status", addUser);
router.get("/all", getUsers);


router.post("/register", addUser);



export default router;
