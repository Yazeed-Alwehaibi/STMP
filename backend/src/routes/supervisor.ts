import { Router } from "express";
import { getUnassignedStudents } from "../controllers/supervisor/application";
import { authenticateUser } from "../middleware/auth"; // Middleware to verify user
import { acceptApplication, rejectApplication } from "../controllers/supervisor/appdecision";
import { getReportsBySupervisor, markReport } from "../controllers/supervisor/report";
import { getPresentationsBySupervisor, setPresentationDate } from "../controllers/supervisor/presentations";

const router = Router();

// Get unassigned students: Only accessible by authenticated users (supervisors)
router.get("/applications/unassigned", authenticateUser, getUnassignedStudents);

// Accept an application: Only accessible by authenticated users (supervisors)
router.post("/applications/accept", authenticateUser, acceptApplication);

// Reject an application: Only accessible by authenticated users (supervisors)
router.post("/applications/reject", authenticateUser, rejectApplication);

router.get("/reports", authenticateUser, getReportsBySupervisor); // for fetching reports by supervisorID
router.post("/reports/:reportID/mark", authenticateUser, markReport); // for marking a report


router.get("/presentations", authenticateUser, getPresentationsBySupervisor);
router.post("/presentations/:presentationID/set-date", authenticateUser, setPresentationDate);


export default router;
