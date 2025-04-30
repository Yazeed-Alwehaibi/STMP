import { Request, Response } from "express";
import { db } from "../../db";
import { presentation } from "../../db/schema/presentation";
import { usersTable } from "../../db/schema/users";
import { eq, and, isNull } from "drizzle-orm";
import { AuthRequest } from "../../middleware/auth";
import { z } from "zod";

// GET /api/presentations
export const getPresentationsBySupervisor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const supervisorID = req.user?.systemID;

    if (!supervisorID) {
      res.status(401).json({ error: "Unauthorized: No supervisor ID in token" });
      return;
    }

    const results = await db
      .select({
        id: presentation.presentationID,
        studentName: usersTable.UserName,
        fileUrl: presentation.fileUrl,
        date: presentation.presentationDate,
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
      .set({ mark }) // Add feedback if needed: .set({ mark, feedback })
      .where(eq(presentation.presentationID, Number(presentationID)));

    res.status(200).json({ message: "Presentation marked successfully" });
  } catch (error) {
    console.error("Error marking presentation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const setDateSchema = z.object({
  date: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, {
    message: "Date cannot be in the past", // Updated this to match test expectations
  }),
});

export const setPresentationDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { presentationID } = req.params;

    if (!presentationID || !req.body.date) {
      res.status(400).json({ error: "PresentationID and date are required" });
      return;
    }

    const parsed = setDateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }

    const { date } = parsed.data;
    const presentationDate = new Date(date);


    // Check if the presentation exists using Drizzle ORM query
    const existing = await db
      .select()
      .from(presentation)
      .where(eq(presentation.presentationID, Number(presentationID)))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: "Presentation not found" });
      return;
    }

    // Update the presentation date
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
