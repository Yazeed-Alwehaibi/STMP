import { Request, Response } from "express";
import { db } from "../../db/index";
import { applications } from "../../db/schema/application";
import { z } from "zod";

const applySchema = z.object({
  systemID: z.number({ required_error: "systemID is required" }),
  venueID: z.number({ required_error: "venueID is required" }),
});

// POST /api/apply-suggest
export const applyForVenue = async (req: Request, res: Response): Promise<void> => {
  const parseResult = applySchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
    return;
  }

  const { systemID, venueID } = parseResult.data;

  try {
    await db.insert(applications).values({
      studentID: systemID,
      venueID,
      status: "pending",
    });

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Failed to insert application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
