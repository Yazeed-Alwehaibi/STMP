import { Request, Response } from "express";
import { db } from "../../db/index";
import { reports } from "../../db/schema/reports";
import { applications } from "../../db/schema/application";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { reportTypeEnum } from "../../db/schema/reports";

// Setup multer to use memory storage
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

// Get application ID by system ID
export const getApplicationIDBySystemID = async (systemID: string): Promise<number | null> => {
  try {
    const result = await db
      .select({ applicationID: applications.ApplicationID })
      .from(applications)
      .where(
        eq(applications.studentID, parseInt(systemID, 10)) &&
        eq(applications.status, "accepted")
      )
      .limit(1);

    return result.length > 0 ? result[0].applicationID : null;
  } catch (error) {
    console.error("Error fetching applicationID:", error);
    return null;
  }
};

// Submit report
export const submitReport = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Received Data:", req.body);  // Log incoming data
    const { systemID, reportType, reportContent, fileUrl } = req.body;

    if (!systemID || !reportType || !fileUrl) {
      res.status(400).json({ error: "All required fields must be provided" });
      return;
    }

    if (!reportTypeEnum.enumValues.includes(reportType)) {
      res.status(400).json({ error: "Invalid report type" });
      return;

    }

    const applicationID = await getApplicationIDBySystemID(systemID);
    if (!applicationID) {
      res.status(404).json({ error: "Application not found or not accepted" });
      return;
    }

    const application = await db
      .select()
      .from(applications)
      .where(eq(applications.ApplicationID, applicationID))
      .limit(1);

    const studentID = application[0].studentID;
    const supervisorID = application[0].supervisorID;

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

    console.log("Report stored in the database:", newReport[0]);

    res.status(201).json({ message: "Report submitted successfully", report: newReport[0] });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
