import { Request, Response } from "express";
import { db } from "../../db/index";
import { presentation } from "../../db/schema/presentation";
import { applications } from "../../db/schema/application";
import { eq, and } from "drizzle-orm";
import multer from "multer";
import path from "path";

interface AuthRequest extends Request {
  user?: {
    systemID: string;
    // Add other user fields if needed (e.g., role)
  };
}

// Set up multer for file uploads (PDF only)
const storage = multer.memoryStorage();  // Use memoryStorage to store file in memory
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (
      path.extname(file.originalname).toLowerCase() !== ".pptx" ||
      file.mimetype !== "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return cb(new Error("Only .pptx PowerPoint files are allowed"));
    }
    
    cb(null, true);
  },
}).single("presentationFile");

export const getApplicationIDBySystemID = async (systemID: string): Promise<number | null> => {
  try {
    const application = await db
      .select({ applicationID: applications.ApplicationID })
      .from(applications)
.where(
  and(
    eq(applications.studentID, parseInt(systemID, 10)),
    eq(applications.status, 'accepted')
  )
)
.limit(1);

    return application.length > 0 ? application[0].applicationID : null;
  } catch (error) {
    console.error("Error fetching applicationID:", error);
    return null;
  }
};

export const submitPresentation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const systemID = req.user?.systemID;
    const { fileUrl } = req.body;  

    if (!systemID ||  !fileUrl) {
      res.status(400).json({ error: "All required fields must be provided" });
      return;
    }

    const applicationID = await getApplicationIDBySystemID(systemID);
    if (!applicationID) {
      res.status(404).json({ error: "Application not found or not accepted" });
      return;
    }

    const existing = await db
    .select()
    .from(presentation)
    .where(eq(presentation.applicationID, applicationID))
    .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Presentation already submitted" });
      return;
   }


    const application = await db
      .select()
      .from(applications)
      .where(eq(applications.ApplicationID, applicationID))
      .limit(1);


    const studentID = application[0].studentID;
    const supervisorID = application[0].supervisorID;

    const newPresentation = await db
      .insert(presentation)
      .values({
        studentID,
        supervisorID,
        applicationID,
        fileUrl: fileUrl,
      } as typeof presentation.$inferInsert)
      .returning();

    console.log("Presentation stored in the database:", newPresentation[0]);

    res.status(201).json({ message: "Presentation submitted successfully", presentation: newPresentation[0] });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
