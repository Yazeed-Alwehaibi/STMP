import { db } from "../../db/index";
import { offers } from "../../db/schema/offers";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { venues } from "../../db/schema/venues";
import { AuthRequest } from "../../middleware/auth";
import { createOfferSchema } from "../../zod/offerSchema"; // Adjust the path

export const createOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate the request body using createOfferSchema
    const parseResult = createOfferSchema.safeParse(req.body);
    if (!parseResult.success) {
       res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.format(),
      });
      return;
    }

    // Extract repID from the authenticated user token
    const repID = req.user?.systemID;

    if (!repID) {
       res.status(401).json({ success: false, message: "Unauthorized" });
       return;
    }

    const { title, description, startDate, endDate, maxParticipant } = req.body;

    // Validate startDate and endDate
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ success: false, message: "Invalid startDate or endDate" });
      return;
    }

    // Get venueID from the repID
    const [venueRecord] = await db.select().from(venues).where(eq(venues.repID, Number(repID)));

    if (!venueRecord) {
      res.status(404).json({ success: false, message: "Venue not found for representative" });
      return;
    }

    const venueID = venueRecord.venueID;

    // Insert the new offer into the database
    const [newOffer] = await db.insert(offers).values({
      venueID: Number(venueID),
      repID: Number(repID),
      title: String(title),
      description: String(description),
      startDate: start,
      endDate: end,
      maxParticipant: Number(maxParticipant),
      status: "active",
    }).returning();

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer: newOffer,
    });    
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create offer" });
  }
};
