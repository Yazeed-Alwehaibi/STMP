import express from "express";
import { addUser, getUsers } from "../controllers/userController";

const router = express.Router();

router.get("/add/:userid/:name/:email/:role/:department/:extrainfo/:password/:status", addUser);
router.get("/all", getUsers);


router.get("/register", (req, res) => {
    console.log("Received data:", req.body);  // Log the received data
    res.json({ message: "User registered successfully!", receivedData: req.body });
});


export default router;
