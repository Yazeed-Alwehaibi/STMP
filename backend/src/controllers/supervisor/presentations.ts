import { Request, Response } from "express";
import { db } from "../../db";
import { presentation } from "../../db/schema/presentation";
import { eq } from "drizzle-orm";

// Get all presentations for a supervisor
export const getPresentationsBySupervisor =  async (req: Request, res: Response): Promise<void> => {
    try {
    const { supervisorID } = req.query;

    if (!supervisorID) {
      res.status(400).json({ error: "SupervisorID is required" });
      return;
    }

    const results = await db
      .select()
      .from(presentation)
      .where(eq(presentation.supervisorID, Number(supervisorID)));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Set presentation date
export const setPresentationDate =  async (req: Request, res: Response): Promise<void> => {
  try {
    const { presentationID } = req.params;
    const { date } = req.body;

    if (!presentationID || !date) {
      res.status(400).json({ error: "PresentationID and date are required" });
      return;
    }

    await db
      .update(presentation)
      .set({ presentationDate: date })
      .where(eq(presentation.presentationID, Number(presentationID)));

    res.json({ message: "Date set successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating date" });
  }
};
