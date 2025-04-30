import request from "supertest";
import app from "../../server";  // Assuming your server file
import { db } from "../../db";  // Assuming your database setup
import { usersTable as users } from "../../db/schema/users";  // User schema
import { applications } from "../../db/schema/application";  // Application schema
import { reports } from "../../db/schema/reports";  // Reports schema
import { eq } from "drizzle-orm";  // Assuming you're using drizzle ORM
import jwt from "jsonwebtoken";

// Create a test token with SystemID that will exist in the users table
let testToken: string;
let systemID: number;
let nonExistentSystemID: number;  // Non-existent user for testing 404
let acceptedApplicationID: number;  // Application ID for valid student

// Generate a unique email each time
const getUniqueEmail = () => `test-${Date.now()}@example.com`;

describe("POST /api/report/submit", () => {
  beforeAll(async () => {
    const uniqueEmail = getUniqueEmail(); // Generate a unique email

    // Insert a user with a unique email and retrieve their SystemID
    const result = await db.insert(users).values({
      UserID: 1201,
      UserName: "Test Student",
      Email: uniqueEmail,
      Role: "Student",
      DepartmentOrMajor: "Computer Science",
      ExtraInfo: "120 hours, GPA: 4.5",
      Status: "active",
      Password: "$2b$10$cFEu6nQBC3UX.RlHOawkYO06Ennky7lgLJzbe6NQRfkI26EIhxWcG"  // hashed password for test
    }).returning();

    // Get the generated SystemID
    systemID = result[0].SystemID;

    // Insert an accepted application for the student
    const applicationResult = await db.insert(applications).values({
      studentID: systemID,
      status: "accepted",
      supervisorID: 3,  
    }).returning();

    acceptedApplicationID = applicationResult[0].ApplicationID;

    // Generate the JWT token for the student
    testToken = jwt.sign({ email: uniqueEmail, systemID: systemID }, process.env.JWT_SECRET || "your_secret_key");

    // Insert a non-existent systemID for testing
    nonExistentSystemID = 9999;  // Use a SystemID that does not exist in the database
  });

  afterAll(async () => {
    // Delete reports associated with the student
    await db.delete(reports).where(eq(reports.applicationID, acceptedApplicationID));
  
    // Now delete the application and user
    await db.delete(applications).where(eq(applications.studentID, systemID));
    await db.delete(users).where(eq(users.SystemID, systemID));
  
    await db.$client.end(); 
  });
  

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/report/submit")
      .set("Cookie", [`token=${testToken}`])
      .send({
        fileUrl: "",  // Missing other required fields
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 for invalid report type", async () => {
    const response = await request(app)
      .post("/api/report/submit")
      .set("Cookie", [`token=${testToken}`])
      .send({
        type: "invalidType",  // Invalid type
        fileUrl: "http://localhost:3000/uploads/test-report.pdf",
        content: "This is a test report"
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 404 if student has no accepted application", async () => {
    const uniqueEmail = getUniqueEmail();
    const result = await db.insert(users).values({
      UserID: 1202,
      UserName: "No Application Student",
      Email: uniqueEmail,
      Role: "Student",
      DepartmentOrMajor: "Computer Science",
      ExtraInfo: "120 hours, GPA: 4.0",
      Status: "active",
      Password: "$2b$10$dummyhashedpasswordfortest"
    }).returning();
  
    const tempSystemID = result[0].SystemID;
    const token = jwt.sign({ email: uniqueEmail, systemID: tempSystemID }, process.env.JWT_SECRET || "your_secret_key");
  
    const response = await request(app)
      .post("/api/report/submit")
      .set("Cookie", [`token=${token}`])
      .send({
        reportType: "final",
        fileUrl: "http://localhost:3000/uploads/test-report.pdf",
        reportContent: "This is a test report"
      });
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  
    // Cleanup
    await db.delete(users).where(eq(users.SystemID, tempSystemID));
  });
  
  

  it("should submit a report successfully", async () => {
    const response = await request(app)
      .post("/api/report/submit")
      .set("Cookie", [`token=${testToken}`])
      .send({
        reportType: "final",  // Ensure this is correctly passed
        fileUrl: "http://localhost:3000/uploads/test-report.pdf",  // Ensure the URL is valid
        reportContent: "This is a test final report"  // Ensure content is present
      });
  
    expect(response.status).toBe(201);  // Expecting 201 for successful report submission
    expect(response.body.report).toHaveProperty("reportID");
    expect(response.body.report.fileUrl).toBe("http://localhost:3000/uploads/test-report.pdf");
  });
  
  

  it("should return 401 without token", async () => {
    const response = await request(app)
      .post("/api/report/submit")
      .send({
        type: "final",
        fileUrl: "http://localhost:3000/uploads/test-report.pdf",
        content: "This is a test final report"
      });

    expect(response.status).toBe(401);  // Unauthorized without token
  });
});
