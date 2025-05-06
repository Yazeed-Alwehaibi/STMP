import { Request, Response } from "express";
import { db } from "../../db/index";
import { reports } from "../../db/schema/reports";
import { usersTable } from "../../db/schema/users"; // <-- import your user table
import { eq, and, isNull } from "drizzle-orm";
import { AuthRequest } from "../../middleware/auth";
import { z } from "zod";



// GET /api/reports?supervisorID=123

export const getReportsBySupervisor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const supervisorID = req.user?.systemID;

    if (!supervisorID) {
      res.status(400).json({ error: "SupervisorID is required" });
      return;
    }

    if (!supervisorID) {
      res.status(400).json({ error: "SupervisorID is required" });
      return;
    }

    const supervisorReports = await db
      .select({
        reportID: reports.reportID,
        mark: reports.mark,
        feedback: reports.feedback,
        studentID: reports.studentID,
        supervisorID: reports.supervisorID,
        applicationID: reports.applicationID,
        studentName: usersTable.UserName,
        submissionDate: reports.submissionDate,
        type: reports.type,
        status: reports.status,
        content: reports.content,
        fileUrl: reports.fileUrl,
      })
      .from(reports)
      .innerJoin(usersTable, eq(reports.studentID, usersTable.SystemID))
      .where(
        and(
          eq(reports.supervisorID, Number(supervisorID)),
          isNull(reports.mark)
        )
      );

    // Convert report ID to string if needed
    const formatted = supervisorReports.map((r) => ({
      ...r,
      reportID: String(r.reportID),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markReportSchema = z.object({
  mark: z.number().min(0).max(100),  // Ensure mark is a number within a valid range
  feedback: z.string().min(1),       // Ensure feedback is a non-empty string
});

export const markReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportID } = req.params;
    const parseResult = markReportSchema.safeParse(req.body);

    if (!reportID || !parseResult.success) {
      res.status(400).json({ error: "Invalid mark or feedback." });
      return;
    }

    // Ensure reportID is provided
    if (!reportID) {
      res.status(400).json({ error: "Report ID is required." });
      return;
    }

    console.log("Marking report:", { reportID, body: req.body });

    const { mark, feedback } = parseResult.data;

    // Optional: You can also validate mark range explicitly if needed
    if (mark < 0 || mark > 100) {
      res.status(400).json({ error: "Mark must be between 0 and 100." });
      return;
    }

    // Update the report in the database
    await db
    .update(reports)
    .set({
      mark: String(mark),  // Convert the number to a string before setting it
      feedback,
    })
    .where(eq(reports.reportID, Number(reportID)));
    // Confirm the report exists after update
    const updatedReport = await db
      .select()
      .from(reports)
      .where(eq(reports.reportID, Number(reportID)))
      .limit(1)
      .then((rows) => rows[0]);

    if (!updatedReport) {
      res.status(404).json({ error: "Report not found." });
      return;
    }

    // Respond with success and the updated report
    res.status(200).json({
      message: "Report marked successfully",
      updatedReport,
    });
  } catch (error) {
    console.error("Error marking report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};