import { Request, Response } from "express";
import { db } from "../../db/index";
import { reports } from "../../db/schema/reports";
import { applications } from "../../db/schema/application";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { reportTypeEnum } from "../../db/schema/reports";

// Set up multer for file uploads (PDF only)
const storage = multer.memoryStorage();  // Use memoryStorage to store file in memory
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (path.extname(file.originalname) !== ".pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
}).single("reportFile");

export const getApplicationIDBySystemID = async (systemID: string): Promise<number | null> => {
  try {
    const application = await db
      .select({ applicationID: applications.ApplicationID })
      .from(applications)
      .where(
        eq(applications.studentID, parseInt(systemID, 10)) &&
        eq(applications.status, 'accepted')
      ) // Replace 'SystemIDColumn' with the actual column name
      .limit(1);

    return application.length > 0 ? application[0].applicationID : null;
  } catch (error) {
    console.error("Error fetching applicationID:", error);
    return null;
  }
};

export const submitReport = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { systemID, reportType, reportContent } = req.body;
    if (!systemID || !reportType || !reportContent || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate reportType against ENUM
    if (!reportTypeEnum.enumValues.includes(reportType)) {
      return res.status(400).json({ error: "Invalid report type" });
    }

    try {
      // Fetch applicationID using systemID
      const applicationID = await getApplicationIDBySystemID(systemID);
      if (!applicationID) {
        return res.status(404).json({ error: "Application not found or not accepted" });
      }

      // Fetch application details to get studentID and supervisorID
      const application = await db
        .select()
        .from(applications)
        .where(eq(applications.ApplicationID, applicationID))
        .limit(1);

      const studentID: number = application[0].studentID ?? 0;
      const supervisorID: number = application[0].supervisorID ?? 0;
      
      // Get the file buffer directly from memory (as we used memoryStorage in multer)
      const fileBuffer = req.file?.buffer;

      // Insert report into database, storing the file buffer directly
      const newReport = await db
        .insert(reports)
        .values({
          studentID: studentID,
          supervisorID: supervisorID,
          applicationID: applicationID,
          type: reportType,
          content: reportContent,
          file: fileBuffer,  // Store the file as a buffer in the database
        })
        .returning();

        console.log("Report stored in the database:", newReport[0]);


      res.status(201).json({ message: "Report submitted successfully", report: newReport[0] });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Database error" });
    }
  });
};
