import { Request, Response } from "express";
import { db } from "../../db/index";
import { venues } from "../../db/schema/venues";
import { venueDepartments } from "../../db/schema/venues";
import { inArray } from "drizzle-orm";

// POST /api/match-venues
export const matchVenues = async (req: Request, res: Response): Promise<void> => {
  const { preferences } = req.body;

  // Validate request
  if (!Array.isArray(preferences) || preferences.length === 0) {
    res.status(400).json({ error: "No preferences selected" });
    return;
  }

  try {
    // Step 1: Find venue IDs that match at least one of the preferences
    const matchingVenueIDs = await db
      .select({ venueId: venueDepartments.venueId })
      .from(venueDepartments)
      .where(inArray(venueDepartments.departmentId, preferences));

    const uniqueVenueIDs = [...new Set(matchingVenueIDs.map((entry) => entry.venueId))].filter((id): id is number => id !== null);

    // Step 2: Fetch full venue details for those IDs
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
