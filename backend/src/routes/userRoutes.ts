import express from "express";
import { addUser, getUsers } from "../controllers/userController";
import { getProfile } from "../controllers/userController";
import { authenticateUser } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { registerUserSchema } from "../zod/zodSchemas";

const router = express.Router();

router.get("/all", getUsers);


router.post("/register", addUser);

router.get("/profile", authenticateUser, getProfile);

router.post("/register", validateBody(registerUserSchema), addUser);


export default router;
