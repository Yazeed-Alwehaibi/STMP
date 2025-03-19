import { Request, Response } from "express";
import { db } from "../../db/index"; // Adjust path based on your project structure
import { applications } from "../../db/schema/application";
import { eq} from "drizzle-orm";
import { AuthRequest } from "../../middleware/auth";

// Accept a student application and set the status to 'accepted'
export const acceptApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId, supervisorID } = req.body; // Get applicationId and supervisorID from request body

    // Ensure systemID exists in req.user
    const supervisorId = req.user?.systemID;
    if (!supervisorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }


    if (supervisorID !== supervisorId) {
      res.status(403).json({ error: "Forbidden: Supervisor ID mismatch" });
      return;
    }

    // Update the application status to 'accepted'
    const updated = await db
      .update(applications)
      .set({ status: 'accepted', supervisorID: Number(supervisorId) })
      .where(eq(applications.ApplicationID, applicationId));

    if (updated.count === 0) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.json({ message: "Application accepted" });
  } catch (error) {
    console.error("Error accepting application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Deny a student application and set the status to 'denied'
export const rejectApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId, supervisorID } = req.body; // Get applicationId and supervisorID from request body

    // Ensure systemID exists in req.user
    const supervisorId = req.user?.systemID;
    if (!supervisorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (supervisorID !== supervisorId) {
      res.status(403).json({ error: "Forbidden: Supervisor ID mismatch" });
      return;
    }

    // Update the application status to 'denied'
    const updated = await db
      .update(applications)
      .set({ status: 'denied', supervisorID: Number(supervisorId) })
      .where(eq(applications.ApplicationID, applicationId));

    if (updated.count === 0) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.json({ message: "Application denied" });
  } catch (error) {
    console.error("Error denying application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
