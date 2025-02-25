import express from "express";
import { addUser, getUsers } from "../controllers/userController";

const router = express.Router();

router.get("/add/:name/:age/:email", addUser);
router.get("/all", getUsers);


export default router;
