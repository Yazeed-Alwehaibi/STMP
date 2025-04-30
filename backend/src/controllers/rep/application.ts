import { db } from "../../db/index";
import { offers } from "../../db/schema/offers";
import { participants } from "../../db/schema/participants";
import { usersTable } from "../../db/schema/users";
import { eq } from "drizzle-orm";
import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";

// Helper to extract GPA from ExtraInfo string
function extractGPA(extraInfo: string | null): string {
  if (!extraInfo) return "N/A";
  const match = extraInfo.match(/GPA:\s*([\d.]+)/);
  return match?.[1] ?? "N/A";
}

// Fetch offers created by the rep
export const fetchRepOffers = async (req: AuthRequest, res: Response): Promise<void> => {
  const repID = req.user?.systemID;

  if (!repID) {
    res.status(401).json({ success: false, message: "Unauthorized: Missing systemID in token" });
    return;
  }

  try {
    const repOffers = await db
      .select()
      .from(offers)
      .where(eq(offers.repID, Number(repID)));

    res.json({ success: true, offers: repOffers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch offers." });
  }
};

// Fetch participants and their information for a specific offer
export const fetchOfferParticipants = async (req: AuthRequest, res: Response): Promise<void> => {
  const { offerID } = req.query;

  if (!offerID) {
    res.status(400).json({ success: false, message: "Missing offerID" });
    return;
  }

  try {
    const participantList = await db
      .select({
        participantID: participants.participantID,
        status: participants.status,
        SystemID: usersTable.SystemID,
        UserID: usersTable.UserID,
        UserName: usersTable.UserName,
        DepartmentOrMajor: usersTable.DepartmentOrMajor,
        ExtraInfo: usersTable.ExtraInfo,
      })
      .from(participants)
      .innerJoin(usersTable, eq(participants.studentID, usersTable.SystemID))
      .where(eq(participants.offerID, Number(offerID)));

    const mappedParticipants = participantList.map((p) => ({
      participantID: p.participantID,
      status: p.status,
      userID: p.UserID,
      userName: p.UserName,
      department: p.DepartmentOrMajor,
      gpa: extractGPA(p.ExtraInfo ?? null),
    }));

    res.json({ success: true, participants: mappedParticipants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch participants." });
  }
};

// Accept participant
export const acceptParticipant = async (req: AuthRequest, res: Response): Promise<void> => {
  const { participantID } = req.body;

  if (!participantID) {
    res.status(400).json({ success: false, message: "Missing participantID" });
    return;
  }

  try {
    await db
      .update(participants)
      .set({ status: "accepted" })
      .where(eq(participants.participantID, Number(participantID)));

    res.json({ success: true, message: "Participant accepted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to accept participant." });
  }
};

// Reject participant
export const rejectParticipant = async (req: AuthRequest, res: Response): Promise<void> => {
  const { participantID } = req.body;

  if (!participantID) {
    res.status(400).json({ success: false, message: "Missing participantID" });
    return;
  }

  try {
    await db
      .update(participants)
      .set({ status: "rejected" })
      .where(eq(participants.participantID, Number(participantID)));

    res.json({ success: true, message: "Participant rejected." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to reject participant." });
  }
};
