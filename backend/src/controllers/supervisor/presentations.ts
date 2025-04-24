import { Request, Response } from "express";
import { db } from "../../db";
import { presentation } from "../../db/schema/presentation";
import { usersTable } from "../../db/schema/users";
import { eq, and, isNull } from "drizzle-orm";

// GET /api/presentations?supervisorID=123
export const getPresentationsBySupervisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { supervisorID } = req.query;

    if (!supervisorID) {
      res.status(400).json({ error: "SupervisorID is required" });
      return;
    }

    const results = await db
      .select({
        id: presentation.presentationID,
        studentName: usersTable.UserName,
        fileUrl: presentation.fileUrl,
        presentationDate: presentation.presentationDate,
        mark: presentation.mark,
      })
      .from(presentation)
      .innerJoin(usersTable, eq(presentation.studentID, usersTable.SystemID))
      .where(
        and(
          eq(presentation.supervisorID, Number(supervisorID)),
          isNull(presentation.mark)
        )
      );

    const formatted = results.map((p) => ({
      ...p,
      id: String(p.id),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching presentations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/presentations/:presentationID/mark
export const markPresentation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { presentationID } = req.params;
    const { mark, feedback } = req.body;

    if (!presentationID || mark === undefined || feedback === undefined) {
      res.status(400).json({ error: "PresentationID, mark, and feedback are required" });
      return;
    }

    await db
      .update(presentation)
      .set({ mark }) // Add feedback here if needed: .set({ mark, feedback })
      .where(eq(presentation.presentationID, Number(presentationID)));

    res.status(200).json({ message: "Presentation marked successfully" });
  } catch (error) {
    console.error("Error marking presentation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/presentations/:presentationID/set-date
export const setPresentationDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { presentationID } = req.params;
    const { date } = req.body;

    if (!presentationID || !date) {
      res.status(400).json({ error: "PresentationID and date are required" });
      return;
    }

    // Convert string date to Date object
    const presentationDate = new Date(date);

    // Optional validation: Ensure future date
    const now = new Date();
    if (presentationDate < now) {
      res.status(400).json({ error: "Date cannot be in the past" });
      return;
    }

    await db
      .update(presentation)
      .set({ presentationDate })
      .where(eq(presentation.presentationID, Number(presentationID)));

    res.status(200).json({ message: "Presentation date set successfully" });
  } catch (error) {
    console.error("Error setting presentation date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
