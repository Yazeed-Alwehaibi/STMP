import { Router } from "express";
import { getUnassignedStudents } from "../controllers/supervisor/application";
import { authenticateUser } from "../middleware/auth"; // Middleware to verify user

const router = Router();

router.get("/applications/unassigned", authenticateUser, getUnassignedStudents);

export default router;
