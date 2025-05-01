import { db } from "../../db/index";
import { offers } from "../../db/schema/offers";
import { participants } from "../../db/schema/participants";
import { eq , and } from "drizzle-orm";
import { AuthRequest } from "../../middleware/auth";


export const getActiveOffers = async (req: any, res: any) => {
  try {
    const activeOffers = await db
      .select()
      .from(offers)
      .where(eq(offers.status, "active"));

    res.status(200).json(activeOffers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch active offers" });
  }
};




export const applyToOffer = async (req: AuthRequest, res: any) => {
    const { offerID } = req.body;
    const studentID = req.user?.systemID; // Assuming you have a way to get the student ID from the request
  
    if (!offerID || !studentID) {
      return res.status(400).json({ error: "Missing offerID or studentID" });
    }
  
    try {
      // Correct way: Use select() + where()
      const existingApplication = await db.select()
        .from(participants)
        .where(
          and(
            eq(participants.offerID, offerID),
            eq(participants.studentID, Number(studentID))
          )
        )
        .limit(1); // Only check the first match
  
      if (existingApplication.length > 0) {
        return res.status(409).json({ error: "You have already applied to this offer." });
      }
  
      // Insert if not applied
      await db.insert(participants).values({
        offerID: Number(offerID),
        studentID: Number(studentID),
        status: "pending",
      });
  
      res.status(201).json({ message: "Applied successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to apply to offer" });
    }
  };