import request from "supertest";
import app from "../../server"; // Adjust path
import { db } from "../../db/index";
import { applications } from "../../db/schema/application";
import { eq } from "drizzle-orm";

describe("Venue Suggestion APIs", () => {
  const testSystemID = 2;
  const testVenueID = 2;

  it("should return 400 if preferences are missing", async () => {
    const res = await request(app)
      .post("/api/match-venues")
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return venues for valid preferences", async () => {
    const res = await request(app)
      .post("/api/match-venues")
      .send({ preferences: [1, 2] });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return 400 for missing systemID/venueID", async () => {
    const res = await request(app).post("/api/apply-suggest").send({});
    expect(res.status).toBe(400);
  });

  it("should apply to a venue successfully", async () => {
    const res = await request(app)
      .post("/api/apply-suggest")
      .send({ systemID: testSystemID, venueID: testVenueID });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/success/i);

    // Cleanup
    await db.delete(applications).where(eq(applications.studentID, testSystemID));
  });

  afterAll(async () => {
    await db.$client.end(); // Properly close the database connection
  });

});
