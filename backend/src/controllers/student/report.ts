import { Request, Response } from "express";
import { db } from "../../db/index";
import { reports } from "../../db/schema/reports";
import { applications } from "../../db/schema/application";
import { eq, and } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { reportTypeEnum } from "../../db/schema/reports";

// Define a custom Request type to add user data (systemID) from JWT or session
interface AuthRequest extends Request {
  user?: {
    systemID: string;
    // Add other user fields if needed (e.g., role)
  };
}

// Setup multer to handle file uploads, with file type validation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".pdf", ".doc", ".docx", ".ppt", ".pptx"].includes(ext)) {
      return cb(new Error("Only PDF, DOC, DOCX, PPT, and PPTX files are allowed"));
    }
    cb(null, true);
  },
}).single("file");

// Function to fetch the accepted application ID for a student
export const getApplicationIDBySystemID = async (systemID: string): Promise<number | null> => {
  try {
    const result = await db
      .select({ applicationID: applications.ApplicationID })
      .from(applications)
      .where(
        and(
          eq(applications.studentID, parseInt(systemID, 10)),
          eq(applications.status, "accepted")
        )
      )
      .limit(1);
      
    return result.length > 0 ? result[0].applicationID : null;
  } catch (error) {
    console.error("Error fetching applicationID:", error);
    return null;
  }
};

// Submit report handler
export const submitReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Extract user and request data
    const systemID = req.user?.systemID;
    const { reportType, reportContent, fileUrl } = req.body;

    // Validation: Check for missing required fields
    if (!systemID || !reportType || !fileUrl || !reportContent) {
      res.status(400).json({ error: "All required fields must be provided" });
      return;
    }

    // Validate report type
    if (!reportTypeEnum.enumValues.includes(reportType)) {
      res.status(400).json({ error: "Invalid report type" });
      return;
    }



    // Fetch the application ID associated with the student
    const applicationID = await getApplicationIDBySystemID(systemID);
    if (!applicationID) {
     res.status(404).json({ error: "No accepted application found" });
     return;
    }


    // Fetch application details, including supervisor information
    const application = await db
      .select()
      .from(applications)
      .where(eq(applications.ApplicationID, applicationID))
      .limit(1);

    const studentID = application[0].studentID;
    const supervisorID = application[0].supervisorID;

    // Insert the new report into the database
    const newReport = await db
      .insert(reports)
      .values({
        studentID,
        supervisorID,
        applicationID,
        type: reportType,
        content: reportContent,
        fileUrl: fileUrl,
      } as typeof reports.$inferInsert)
      .returning();

    // Log and respond with success
    console.log("Report stored in the database:", newReport[0]);
    res.status(201).json({ message: "Report submitted successfully", report: newReport[0] });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
