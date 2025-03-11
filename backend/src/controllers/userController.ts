import { Request, Response } from "express";
import { db } from "../db/index";
import { usersTable } from "../db/schema/users";


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
  const { 
    userID, 
    name, 
    email, 
    role, 
    department, 
    extrainfo,  
  } = req.body; 

  if (!userID || !name || !email || !role  ) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const validRoles = ["Supervisor", "Student", "Training Representative"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    const insertedUser = await db.insert(usersTable).values({ 
      UserID: parseInt(userID), // Ensure UserID is a number
      UserName: name, 
      Email: email,
      Role: role as "Supervisor" | "Student" | "Training Representative",
      DepartmentOrMajor: department,  // Adding the new column for DepartmentOrMajor
      ExtraInfo: extrainfo,                  // Adding the new column for ExtraInfo
      Password: generateRandomPassword(),
    }).returning();

    res.status(201).json({
      message: "User added successfully",
      user: insertedUser[0],
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