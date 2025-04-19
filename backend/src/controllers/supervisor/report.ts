import { Request, Response } from "express";
import { db } from "../../db";
import { reports } from "../../db/schema/reports";
import { usersTable } from "../../db/schema/users"; // <-- import your user table
import { eq, and, isNull } from "drizzle-orm";

// GET /api/reports?supervisorID=123

export const getReportsBySupervisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { supervisorID } = req.query;

    if (!supervisorID) {
      res.status(400).json({ error: "SupervisorID is required" });
      return;
    }

    const supervisorReports = await db
      .select({
        id: reports.reportID,
        studentName: usersTable.UserName, // adjust if name is different
        supervisorID: reports.supervisorID,
        mark: reports.mark,
        feedback: reports.feedback,
      })
      .from(reports)
      .innerJoin(usersTable, eq(reports.studentID, usersTable.SystemID)) // updated to use usersTable
      .where(
        and(
          eq(reports.supervisorID, Number(supervisorID)),
          isNull(reports.mark) // only unmarked reports
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


// POST /api/reports/:reportID/mark
export const markReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportID } = req.params;
    const { mark, feedback } = req.body;

    if (!reportID || mark === undefined || feedback === undefined) {
      res.status(400).json({ error: "ReportID, mark, and feedback are required" });
      return;
    }

    await db
      .update(reports)
      .set({ mark, feedback })
      .where(eq(reports.reportID, Number(reportID)));

    res.status(200).json({ message: "Report marked successfully" });
  } catch (error) {
    console.error("Error marking report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
