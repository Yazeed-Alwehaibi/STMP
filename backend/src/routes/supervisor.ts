import { Router } from "express";
import { getUnassignedStudents } from "../controllers/supervisor/application";
import { authenticateUser } from "../middleware/auth"; // Middleware to verify user
import { acceptApplication, rejectApplication } from "../controllers/supervisor/appdecision";

const router = Router();

// Get unassigned students: Only accessible by authenticated users (supervisors)
router.get("/applications/unassigned", authenticateUser, getUnassignedStudents);

// Accept an application: Only accessible by authenticated users (supervisors)
router.post("/applications/accept", authenticateUser, acceptApplication);

// Reject an application: Only accessible by authenticated users (supervisors)
router.post("/applications/reject", authenticateUser, rejectApplication);

export default router;
