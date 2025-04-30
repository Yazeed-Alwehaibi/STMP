import request from "supertest";
import app from "../../server"; // your Express app
import { NextFunction, Response } from "express";
import { db } from "../../db";
import { presentation } from "../../db/schema/presentation";

jest.mock("../../middleware/auth", () => ({
  authenticateUser: (_req: { user?: { systemID: number } }, _res: Response, next: NextFunction) => {
    _req.user = { systemID: 3 }; // sample supervisor
    next();
  },
}));

beforeAll(async () => {
  // Setup: Insert mock presentation before running tests
  await db.insert(presentation).values({
    studentID: 4,
    supervisorID: 3,
    applicationID: 19, // Add a valid applicationID
    presentationDate: new Date(),
    fileUrl: "mock-file-url",
  });
});

afterAll(async () => {
  // Cleanup: End DB client connection
  await db.$client.end();
});

describe("POST /api/presentations/:presentationID/set-date", () => {
  it("sets the date successfully", async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10); // Tomorrow

    const response = await request(app)
      .post("/api/presentations/6/set-date") // Using an existing presentation ID
      .send({ date: futureDate });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Presentation date set successfully");
  });

  it("rejects invalid past date", async () => {
    const pastDate = "2000-01-01";

    const response = await request(app)
      .post("/api/presentations/1/set-date")
      .send({ date: pastDate });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Date cannot be in the past/i); // Updated validation message
  });

  it("rejects missing date", async () => {
    const response = await request(app)
      .post("/api/presentations/1/set-date")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/PresentationID and date are required/i); // Updated error message
  });
});
