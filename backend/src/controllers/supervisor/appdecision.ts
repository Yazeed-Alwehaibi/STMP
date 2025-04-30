import { Request, Response } from "express";
import { db } from "../../db/index"; // Adjust path based on your project structure
import { applications } from "../../db/schema/application";
import { eq} from "drizzle-orm";
import { AuthRequest } from "../../middleware/auth";

// Accept a student application and set the status to 'accepted'
// acceptApplication.ts
export const acceptApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.body;
    const supervisorId = req.user?.systemID;

    if (!supervisorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

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

// rejectApplication.ts
export const rejectApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.body;
    const supervisorId = req.user?.systemID;

    // Check if supervisor ID exists
    if (!supervisorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Perform the update operation
    const updated = await db
      .update(applications)
      .set({ status: 'denied', supervisorID: Number(supervisorId) })
      .where(eq(applications.ApplicationID, applicationId));

    console.log(updated);  // Log the result to verify the count

    // If no rows were updated, return an error (application not found)
    if (updated.count === 0) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    // If the application was successfully denied, return success message
    res.json({ message: "Application denied" });
  } catch (error) {
    // Log the error and return a 500 internal server error response
    console.error("Error denying application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
