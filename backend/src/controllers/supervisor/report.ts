import { Request, Response } from "express";
import { db } from "../../db";
import { reports } from "../../db/schema/reports";
import { eq } from "drizzle-orm";

// Get reports assigned to a supervisor
export const getReportsBySupervisor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { supervisorID } = req.query; // Extract supervisorID from the query string
  
      if (!supervisorID) {
        res.status(400).json({ error: "SupervisorID is required" });
        return; // Make sure to return to prevent further execution
      }
  
      const supervisorReports = await db
        .select()
        .from(reports) // Fetch reports based on supervisorID
        .where(eq(reports.supervisorID, Number(supervisorID)));
  
      res.json(supervisorReports); // Send the reports as JSON
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

// Mark a report and provide feedback
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
      .where(eq(reports.reportID, parseInt(reportID, 10)));

    res.json({ message: "Report marked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating report" });
  }
};
