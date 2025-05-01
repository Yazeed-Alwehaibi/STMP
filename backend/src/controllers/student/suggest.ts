import { Request, Response } from "express";
import { db } from "../../db/index";
import { applications } from "../../db/schema/application";
import { z } from "zod";
import { AuthRequest } from "../../middleware/auth";

const applySchema = z.object({
  venueID: z.number({ required_error: "venueID is required" }),
});

// POST /api/apply-suggest
export const applyForVenue = async (req: AuthRequest, res: Response): Promise<void> => {
  const parseResult = applySchema.safeParse(req.body);
  const studentID = req.user?.systemID; 

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
    return;
  }

  const { venueID } = parseResult.data;

  try {
    await db.insert(applications).values({
      studentID: Number(studentID),
      venueID: parseResult.data.venueID,
      status: "pending",
    });

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Failed to insert application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
