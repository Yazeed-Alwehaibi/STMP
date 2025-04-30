// tests/registerSchema.test.ts
import { registerUserSchema } from "../zod/zodSchemas";

describe("registerUserSchema", () => {
  it("passes with valid data", () => {
    const data = {
      userID: "12345678",
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      department: "Computer Science",
      extrainfo: "120 hours, GPA: 4.5"
    };
    const result = registerUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("fails if email is invalid", () => {
    const result = registerUserSchema.safeParse({
      userID: "123",
      name: "John",
      email: "bademail",
      role: "Supervisor"
    });
    expect(result.success).toBe(false);
  });

  it("fails if role is invalid", () => {
    const result = registerUserSchema.safeParse({
      userID: "12345678",
      name: "User",
      email: "test@example.com",
      role: "Manager"
    });
    expect(result.success).toBe(false);
  });
});
