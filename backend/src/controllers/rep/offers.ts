import { db } from "../../db/index";
import { offers } from "../../db/schema/offers";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { venues } from "../../db/schema/venues"; 

export const createOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { repID, title, description, startDate, endDate, maxParticipant } = req.body;

    // Get venueID from the repID
    const [venueRecord] = await db.select().from(venues).where(eq(venues.repID, repID));

    if (!venueRecord) {
      res.status(404).json({ success: false, message: "Venue not found for representative" });
      return
    }

    const venueID = venueRecord.venueID;

    const [newOffer] = await db.insert(offers).values({
      venueID,
      repID,
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxParticipant,
      status: "active", 
    }).returning();

    res.status(201).json({ success: true, offer: newOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create offer" });
  }
};
