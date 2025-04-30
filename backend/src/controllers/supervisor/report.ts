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
    id: reports.reportID,
    studentName: usersTable.UserName,
    supervisorID: reports.supervisorID,
    mark: reports.mark,
    feedback: reports.feedback,
    fileUrl: reports.fileUrl, // <-- add this line
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
      id: String(r.id),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markReportSchema = z.object({
  mark: z.number().min(0).max(100),
  feedback: z.string().max(1000),
});

export const markReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportID } = req.params;
    const parseResult = markReportSchema.safeParse(req.body);

    if (!reportID || !parseResult.success) {
      res.status(400).json({ error: "Invalid mark or feedback." });
      return;
    }

    const { mark, feedback } = parseResult.data;

    console.log("Marking report:", { reportID, mark, feedback });

    await db
      .update(reports)
      .set({ mark: String(mark), feedback })
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

    res.status(200).json({ message: "Report marked successfully" });
  } catch (error) {
    console.error("Error marking report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};