import { Request, Response } from "express";
import { db } from "../../db/index";
import { venues, venueDepartments } from "../../db/schema/venues";
import { inArray } from "drizzle-orm";
import { z } from "zod";

const matchVenueSchema = z.object({
  preferences: z.array(z.number().int()).min(1, "Select at least one preference"),
});

// POST /api/match-venues
export const matchVenues = async (req: Request, res: Response): Promise<void> => {
  const parseResult = matchVenueSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
    return;
  }

  const { preferences } = parseResult.data;

  try {
    // Step 1: Get all matching venue IDs
    const matchingVenueIDs = await db
      .select({ venueId: venueDepartments.venueId })
      .from(venueDepartments)
      .where(inArray(venueDepartments.departmentId, preferences));

    const uniqueVenueIDs = [...new Set(matchingVenueIDs.map((entry) => entry.venueId))].filter(
      (id): id is number => id !== null
    );

    // Step 2: Get full venue details
    const matchedVenues = await db
      .select()
      .from(venues)
      .where(inArray(venues.venueID, uniqueVenueIDs));

    res.status(200).json(matchedVenues);
  } catch (error) {
    console.error("Error fetching matching venues:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
