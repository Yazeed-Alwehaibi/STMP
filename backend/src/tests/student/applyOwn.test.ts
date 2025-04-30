import request from "supertest";
import app from "../../server";
import { db } from "../../db/index";
import { usersTable as users } from "../../db/schema/users";
import { applications } from "../../db/schema/application";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// Create a test token with SystemID that will exist in the users table
let testToken: string;
let systemID: number;

// Generate a unique email each time
const getUniqueEmail = () => `test-${Date.now()}@example.com`;

describe("POST /api/applyOwn", () => {
  beforeAll(async () => {
    const uniqueEmail = getUniqueEmail(); // Generate a unique email

    // Insert a user with a unique email and retrieve their SystemID
    const result = await db.insert(users).values({
      UserID: 1201,
      UserName: "me a",
      Email: uniqueEmail,
      Role: "Student",
      DepartmentOrMajor: "Computer Science",
      ExtraInfo: "130 hours, GPA: 4.5",
      Status: "active",
      Password: "$2b$10$cFEu6nQBC3UX.RlHOawkYO06Ennky7lgLJzbe6NQRfkI26EIhxWcG"
    }).returning();

    // Get the generated SystemID
    systemID = result[0].SystemID;

    // Generate the JWT token
    testToken = jwt.sign({ email: uniqueEmail, systemID: systemID }, process.env.JWT_SECRET || "your_secret_key");
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(applications).where(eq(applications.studentID, systemID));
    await db.delete(users).where(eq(users.SystemID, systemID));
    await db.$client.end(); // Properly close the database connection

  });

  it("should create a new venue and application", async () => {
    const requestData = {
      venueName: "TestVenuea",
      website: "https://test.com",
      description: "Great training place",
      startDate: "2025-06-11T00:00:00Z",  
      endDate: "2025-09-04T00:00:00Z"    
    };

  
    const response = await request(app)
      .post("/api/applyOwn")
      .set("Cookie", [`token=${testToken}`])
      .send(requestData);
  
  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("application");
    expect(response.body.message).toBe("User and venue processed successfully");
  });

  it("should return 400 for missing fields", async () => {
    const response = await request(app)
      .post("/api/applyOwn")
      .set("Cookie", [`token=${testToken}`])
      .send({
        venueName: "",
        website: "",
        description: "",
        startDate: "",
        endDate: ""
      });

    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 401 without token", async () => {
    const response = await request(app).post("/api/applyOwn").send({
      venueName: "Another Venue",
      website: "https://test2.com",
      description: "No token",
      startDate: "2025-06-01",
      endDate: "2025-08-01"
    });

    expect(response.status).toBe(401);
  });
});
