import request from "supertest";
import app from "../server"; // import your app here
import { db } from "../db/index"; // import your DB connection

// Function to generate a random email
const generateRandomEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 12); // generate a random string
  return `${randomString}@example.com`; // return random email
};

afterAll(async () => {
  // Close DB connection after all tests
  await db.$client?.end?.(); // Use the correct method for your ORM or remove if unnecessary
});

describe("POST /api/register", () => {
  it("should register a new user with valid data", async () => {
    const randomEmail = generateRandomEmail(); // generate a random email

    const response = await request(app)
      .post("/api/register")
      .send({
        userID: "87654321",
        name: "Jane Doe",
        email: randomEmail, // use random email
        role: "Student",
        department: "Computer Science",
        extrainfo: "130 hours, GPA: 4.0"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User added successfully");
    expect(response.body).toHaveProperty("plainPassword"); // Password is returned
    expect(response.body.user).toHaveProperty("UserID");
    expect(response.body.user).toHaveProperty("UserName", "Jane Doe");
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        userID: "12345678",
        role: "Student",
        email: "missingname@example.com"
      }); // name is missing

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should fail if role is invalid", async () => {
    const randomEmail = generateRandomEmail(); // generate a random email

    const response = await request(app)
      .post("/api/register")
      .send({
        userID: "87654322",
        name: "Invalid Role",
        email: randomEmail, // use random email
        role: "UnknownRole", // Invalid
        department: "Computer Science",
        extrainfo: "100 hours, GPA: 3.0"
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid role");
  });
});
