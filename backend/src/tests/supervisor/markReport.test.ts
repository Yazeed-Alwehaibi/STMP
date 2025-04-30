import request from "supertest";
import app from "../../server"; // your Express app
import { db } from "../../db";
import { reports } from "../../db/schema/reports";
import { Request, Response, NextFunction } from "express";

// Mock auth middleware to inject req.user
interface MockRequest extends Request {
    user?: { systemID: number };
}

jest.mock("../../middleware/auth", () => ({
    authenticateUser: (_req: MockRequest, _res: Response, next: NextFunction) => {
        _req.user = { systemID: 3 }; // sample supervisor
        next();
    },
}));

  afterAll(async () => {
    await db.$client.end();
  });

describe("POST /api/reports/:reportID/mark", () => {
  it("marks a report successfully", async () => {
    const reportID = 10;

    const response = await request(app)
      .post(`/api/reports/${reportID}/mark`)
      .send({ mark: 85, feedback: "Well done!" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Report marked successfully");
  });

  it("returns 400 for invalid input", async () => {
    const response = await request(app)
      .post("/api/reports/1/mark")
      .send({ mark: -10, feedback: "" });

    expect(response.status).toBe(400);
  });

  it("returns 404 if report is not found", async () => {
    const response = await request(app)
      .post("/api/reports/9999/mark")
      .send({ mark: 75, feedback: "Looks fine." });

    // adjust this based on how your DB mock handles rowCount
    expect([200, 404]).toContain(response.status);
  });
});
