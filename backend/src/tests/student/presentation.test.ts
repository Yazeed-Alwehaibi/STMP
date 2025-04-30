import request from "supertest";
import app from "../../server";
import { db } from "../../db/index";
import { usersTable as users } from "../../db/schema/users";
import { applications } from "../../db/schema/application";
import { presentation } from "../../db/schema/presentation";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// Setup
let testToken: string;
let systemID: number;
let applicationID: number;
const getUniqueEmail = () => `test-presentation-${Date.now()}@example.com`;

describe("POST /api/presentation/submit", () => {
  beforeAll(async () => {
    const email = getUniqueEmail();

    const userResult = await db.insert(users).values({
      UserID: 1301,
      UserName: "Presentation Tester",
      Email: email,
      Role: "Student",
      DepartmentOrMajor: "Computer Science",
      ExtraInfo: "120 hours, GPA: 4.7",
      Status: "active",
      Password: "$2b$10$dummyhashfortesting"
    }).returning();

    systemID = userResult[0].SystemID;

    const applicationResult = await db.insert(applications).values({
      studentID: systemID,
      status: "accepted",
      supervisorID: 5,
    }).returning();

    applicationID = applicationResult[0].ApplicationID;

    testToken = jwt.sign({ email, systemID }, process.env.JWT_SECRET || "your_secret_key");
  });

  afterAll(async () => {
    await db.delete(presentation).where(eq(presentation.applicationID, applicationID));
    await db.delete(applications).where(eq(applications.ApplicationID, applicationID));
    await db.delete(users).where(eq(users.SystemID, systemID));
    await db.$client.end();
  });

  it("should return 400 if fileUrl is missing", async () => {
    const response = await request(app)
      .post("/api/presentation/submit")
      .set("Cookie", [`token=${testToken}`])
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/required/i);
  });

  it("should return 404 if no accepted application is found", async () => {
    const email = getUniqueEmail();
    const userResult = await db.insert(users).values({
      UserID: 1302,
      UserName: "No App Student",
      Email: email,
      Role: "Student",
      DepartmentOrMajor: "CS",
      ExtraInfo: "GPA: 4.0",
      Status: "active",
      Password: "hashed"
    }).returning();

    const tempSystemID = userResult[0].SystemID;
    const tempToken = jwt.sign({ email, systemID: tempSystemID }, process.env.JWT_SECRET || "your_secret_key");

    const response = await request(app)
      .post("/api/presentation/submit")
      .set("Cookie", [`token=${tempToken}`])
      .send({ fileUrl: "http://localhost:3000/uploads/fake.pptx" });

    expect(response.status).toBe(404);

    await db.delete(users).where(eq(users.SystemID, tempSystemID));
  });

  it("should successfully submit presentation", async () => {
    const response = await request(app)
      .post("/api/presentation/submit")
      .set("Cookie", [`token=${testToken}`])
      .send({ fileUrl: "http://localhost:3000/uploads/presentation-test.pptx" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Presentation submitted successfully");
    expect(response.body.presentation).toHaveProperty("fileUrl");
  });

  it("should return 409 on duplicate submission", async () => {
    const response = await request(app)
      .post("/api/presentation/submit")
      .set("Cookie", [`token=${testToken}`])
      .send({ fileUrl: "http://localhost:3000/uploads/duplicate.pptx" });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/already submitted/i);
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app)
      .post("/api/presentation/submit")
      .send({ fileUrl: "http://localhost:3000/uploads/test.pptx" });

    expect(response.status).toBe(401);
  });
});
