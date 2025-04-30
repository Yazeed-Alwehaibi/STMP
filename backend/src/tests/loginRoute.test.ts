import { login } from "../controllers/authController";
import { db } from "../db";
import { usersTable } from "../db/schema/users";
import request from "supertest";
import app from "../server";

// Shared variable to control which email is being queried
let mockedEmail = '';

// Mock the db.select().from().where().limit() chain
jest.mock("../db", () => {
  const mockWhere = jest.fn().mockImplementation((condition) => {
    return {
      limit: jest.fn().mockImplementation(() => {
        if (mockedEmail === 'm@m.com') {
          return Promise.resolve([
            {
              SystemID: 1,
              UserID: 1,
              UserName: 'me a',
              Email: 'm@m.com',
              Role: 'Student',
              DepartmentOrMajor: 'CS',
              ExtraInfo: 'Some extra info',
              Status: 'Active',
              Password: '$2b$10$cFEu6nQBC3UX.RlHOawkYO06Ennky7lgLJzbe6NQRfkI26EIhxWcG', // bcrypt hash of 'agMP1$])'
            },
          ]);
        } else {
          return Promise.resolve([]);
        }
      }),
    };
  });

  const mockFrom = jest.fn().mockReturnValue({
    where: mockWhere,
  });

  return {
    db: {
      select: jest.fn().mockReturnValue({
        from: mockFrom,
      }),
    },
  };
});

describe("Login Route", () => {
  it("should successfully login the user with valid credentials", async () => {
    mockedEmail = 'm@m.com';

    const response = await request(app)
      .post("/api/login")
      .send({
        email: 'm@m.com',
        password: 'agMP1$])',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toEqual({
      systemId: 1,
      userId: 1,
      email: 'm@m.com',
      username: 'me a',
      role: 'Student',
    });
  });

  it("should return 401 for invalid credentials", async () => {
    mockedEmail = 'wrong@example.com';

    const response = await request(app)
      .post("/api/login")
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User not found");
  });
});
