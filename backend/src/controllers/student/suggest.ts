import { Request, Response } from "express";
import { db } from "../../db/index"; // Adjust path as necessary
import { applications } from "../../db/schema/application"; // Assuming Drizzle schema defined
import { eq } from "drizzle-orm";

// POST /api/apply
export const applyForVenue = async (req: Request, res: Response): Promise<void> => {
  const { systemID, venueID } = req.body;

  if (!systemID || !venueID) {
     res.status(400).json({ message: "Missing systemID or venueID" });
     return;
  }

  try {
    await db.insert(applications).values({
      studentID: systemID,
      venueID,
      status: "pending",
    });

    res.status(201).json({ message: "Application submitted successfully" });
    return;
  } catch (error) {
    console.error("Failed to insert application:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
