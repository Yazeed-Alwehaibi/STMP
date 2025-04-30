import request from "supertest";
import app from "../../server"; // Your Express app entry point
import { db } from "../../db/index";
import { offers } from "../../db/schema/offers";
import { participants } from "../../db/schema/participants";
import { eq, and } from "drizzle-orm";

describe("Training Offer APIs", () => {
  let testOfferID: number;
  const testStudentID = 1; // Ensure this matches the expected number type

  beforeAll(async () => {
    const [insertedOffer] = await db
      .insert(offers)
      .values({
        venueID: 2,
        repID: 6,
        title: "Test Offer",
        description: "This is a test training offer",
        startDate: new Date("2025-06-11T00:00:00Z"),
        endDate: new Date("2025-09-04T00:00:00Z"),
        status: "active",
        maxParticipant: 10,
      })
      .returning({ offerID: offers.offerID });
  
    testOfferID = insertedOffer.offerID;
  });
  

  afterAll(async () => {
    // Cleanup test data
    await db.delete(participants).where(eq(participants.studentID, testStudentID)); // Ensure testStudentID is a number
    await db.delete(offers).where(eq(offers.offerID, testOfferID));
  });

  it("should fetch only active offers", async () => {
    const res = await request(app).get("/api/fetchOffers");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          offerID: testOfferID,
          title: "Test Offer",
          status: "active",
        }),
      ])
    );
  });

  it("should return 400 if offerID or studentID is missing", async () => {
    const res = await request(app).post("/api/applyToOffer").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing offerID or studentID");
  });

  it("should apply to an offer successfully", async () => {
    const res = await request(app).post("/api/applyToOffer").send({
      offerID: testOfferID,
      studentID: testStudentID,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Applied successfully!");

    // Check in DB
    const result = await db
      .select()
      .from(participants)
      .where(
        and(
          eq(participants.offerID, testOfferID),
          eq(participants.studentID, testStudentID)
        )
      );
    expect(result.length).toBe(1);
  });

  it("should return 409 if student has already applied", async () => {
    const res = await request(app).post("/api/applyToOffer").send({
      offerID: testOfferID,
      studentID: testStudentID,
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("You have already applied to this offer.");
  });
  
  afterAll(async () => {
    await db.$client.end(); // Properly close the database connection
  });
  
});
