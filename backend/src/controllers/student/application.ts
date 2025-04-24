import { Request, Response } from "express";
import { db } from "../../db/index";
import { applications } from "../../db/schema/application";
import { venues } from "../../db/schema/venues";
import { eq } from "drizzle-orm";

export const applyOwn = async (req: Request, res: Response): Promise<void> => {
  const { venueName, website, systemID, startDate, endDate } = req.body;

  if (!venueName || !website || !systemID || !startDate || !endDate) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (new Date(startDate) >= new Date(endDate)) {
    res.status(400).json({ error: "End date must be after start date" });
    return;
  }

  try {
    let venue = await db.select().from(venues).where(eq(venues.venueName, venueName)).limit(1);
    let venueID: number;

    if (venue.length > 0) {
      venueID = venue[0].venueID;
    } else {
      const insertedVenue = await db.insert(venues).values({
        venueName,
        website,
      }).returning();

      venueID = insertedVenue[0].venueID;
    }

    const insertedApplication = await db.insert(applications).values({
      studentID: parseInt(systemID),
      venueID,
      status: "pending",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    }).returning();

    res.status(201).json({
      message: "User and venue processed successfully",
      application: insertedApplication[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};
