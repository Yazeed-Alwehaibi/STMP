import request from "supertest";
import app from "../../server";
import jwt from "jsonwebtoken";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { venues } from "../../db/schema/venues";

// Replace with a real user in your database
const EXISTING_REP_ID = 67;
const EXISTING_REP_EMAIL = "testrep@example.com";

let token: string;
let tokenin: string; // Token for invalid venue
let venueID: number;

describe("POST /api/offers", () => {
  beforeAll(async () => {
    // Generate JWT for an existing representative
    token = jwt.sign(
      { email: EXISTING_REP_EMAIL, systemID: EXISTING_REP_ID },
      process.env.JWT_SECRET || "your_secret_key"
    );

    tokenin = jwt.sign(
        { email: EXISTING_REP_EMAIL, systemID: 68 },
        process.env.JWT_SECRET || "your_secret_key"
      );
    // Get venue for this rep
    const result = await db
      .select()
      .from(venues)
      .where(eq(venues.repID, EXISTING_REP_ID));

    if (!result[0]) throw new Error("No venue found for representative");

    venueID = result[0].venueID;
  });

  afterAll(async () => {
    await db.$client.end(); // Properly close the database connection
  });

  it("should create a new offer successfully", async () => {
    const res = await request(app)
      .post("/api/offers")
      .set("Cookie", [`token=${token}`])
      .send({
        title: "New Offer",
        description: "Training offer for summer",
        startDate: "2025-06-10T00:00:00Z",
        endDate: "2025-08-10T00:00:00Z",
        maxParticipant: 20,
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Offer created successfully");
    expect(res.body.offer).toHaveProperty("offerID");
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app)
      .post("/api/offers")
      .set("Cookie", [`token=${token}`])
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 401 without token", async () => {
    const res = await request(app).post("/api/offers").send({
      venueID,
      title: "Unauthorized Offer",
      description: "No token provided",
      startDate: "2025-06-10T00:00:00Z",
      endDate: "2025-08-10T00:00:00Z",
      maxParticipant: 20,
      status: "open"
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 404 if venue not found for rep", async () => {
    const res = await request(app)
      .post("/api/offers")
      .set("Cookie", [`token=${tokenin}`])
      .send({
        title: "Invalid Venue Offer",
        description: "This should fail",
        startDate: "2025-06-10T00:00:00Z",
        endDate: "2025-08-10T00:00:00Z",
        maxParticipant: 20,
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Venue not found for representative");
  });
});
