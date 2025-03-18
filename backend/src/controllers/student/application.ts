import { Request, Response } from "express";
import { db } from "../../db/index";
import { applications } from "../../db/schema/application";
import { venues } from "../../db/schema/venues";
import { eq } from "drizzle-orm";

export const applyOwn = async (req: Request, res: Response): Promise<void> => {
  const { venueName, venueDescription, website, systemID } = req.body;

  if (!venueName || !website || !systemID) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // Check if venue exists
    let venue = await db.select().from(venues).where(eq(venues.venueName, venueName)).limit(1);

    let venueID: number;

    if (venue.length > 0) {
      venueID = venue[0].venueID;
    } else {
      // Insert new venue
      const insertedVenue = await db.insert(venues).values({
        venueName,
        website,
      }).returning();

      venueID = insertedVenue[0].venueID;
    }

    // Insert user and venue into applications
    const insertedApplication = await db.insert(applications).values({
      studentID : parseInt(systemID),
      venueID,
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
