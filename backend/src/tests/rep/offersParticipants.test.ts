import request from "supertest";
import app from "../../server";
import jwt from "jsonwebtoken";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { offers } from "../../db/schema/offers";
import { participants } from "../../db/schema/participants";

// Replace with your actual data
const EXISTING_REP_ID = 6;
const EXISTING_REP_EMAIL = "r@r.com"; 

let token: string;
let tokenin: string; // Token for invalid venue
let offerID: number;
let participantID: number;

describe("Rep Applications with existing data", () => {
  beforeAll(async () => {
    // Generate JWT for the representative
    token = jwt.sign(
      { email: EXISTING_REP_EMAIL, systemID: EXISTING_REP_ID },
      process.env.JWT_SECRET || "your_secret_key"
    );

    // Generate JWT for an invalid representative (invalid venue case)
    tokenin = jwt.sign(
      { email: EXISTING_REP_EMAIL, systemID: 68 },
      process.env.JWT_SECRET || "your_secret_key"
    );

    // Fetch one existing offer for the rep
    const repOffers = await db
      .select()
      .from(offers)
      .where(eq(offers.repID, EXISTING_REP_ID));

    if (repOffers.length === 0) throw new Error("No offers found for repID = 6");
    offerID = repOffers[0].offerID;

    // Get one participant for that offer
    const offerParticipants = await db
      .select()
      .from(participants)
      .where(eq(participants.offerID, offerID));

    if (offerParticipants.length === 0) throw new Error(`No participants found for offerID = ${offerID}`);
    participantID = offerParticipants[0].participantID;
  });

  afterAll(async () => {
    await db.$client.end(); // Properly close the database connection
  });

  it("fetches rep offers", async () => {
    const res = await request(app)
      .get("/api/fetchRepOffers")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.offers)).toBe(true);
  });

  it("fetches participants for offer", async () => {
    const res = await request(app)
      .get(`/api/fetchOfferParticipants?offerID=${offerID}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.participants)).toBe(true);
  });

  it("accepts a participant", async () => {
    const res = await request(app)
      .post("/api/acceptParticipant")
      .set("Cookie", [`token=${token}`])
      .send({ participantID });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Participant accepted.");
  });

  it("rejects a participant", async () => {
    const res = await request(app)
      .post("/api/rejectParticipant")
      .set("Cookie", [`token=${token}`])
      .send({ participantID });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Participant rejected.");
  });


  it("should return an empty array when no participants exist for the offer", async () => {
    // Simulating no participants for the offer
    const res = await request(app)
      .get(`/api/fetchOfferParticipants?offerID=${offerID}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.participants).toEqual([]); // Check for empty list
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app)
      .get("/api/fetchRepOffers");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

});
