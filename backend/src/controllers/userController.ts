import { Request, Response } from "express";
import { db } from "../db/index";
import { roleEnum, usersTable } from "../db/schema/users";
import { AuthRequest } from "../middleware/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";


// Function to generate a random password
function generateRandomPassword(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { userID, name, email, role, department, extrainfo } = req.body;

  if (!userID || !name || !email || !role) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const validRoles = ["Supervisor", "Student", "Training Representative"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    // Generate password
    const plainPassword = generateRandomPassword();

    // Encrypt password before storing
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // Salt rounds = 10

    // Insert user into DB with hashed password
    const insertedUser = await db.insert(usersTable).values({ 
      UserID: parseInt(userID), 
      UserName: name, 
      Email: email,
      Role: role as "Supervisor" | "Student" | "Training Representative",
      DepartmentOrMajor: department,
      ExtraInfo: extrainfo,
      Password: hashedPassword, // Store encrypted password
    }).returning();

    // Send the user the **plain password** (e.g., in email response)
    res.status(201).json({
      message: "User added successfully",
      user: insertedUser[0],
      plainPassword, // Send this only in the response, NOT store it
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};


export const getUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(usersTable);
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const systemID = parseInt(req.user.systemID, 10);
  console.log("SystemID from request:", systemID); // Debugging log

  const user = await db.select().from(usersTable).where(eq(usersTable.SystemID, systemID)).limit(1);

  if (!user.length) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  console.log("Fetched User Data:", user[0]); // ✅ Debugging log

  res.json({ 
    user: { 
      id: user[0].SystemID,  // ✅ Return systemID as the primary identifier
      systemID: user[0].SystemID,  
      userName: user[0].UserName, 
      email: user[0].Email, 
      role: user[0].Role 
    } 
  });
};

