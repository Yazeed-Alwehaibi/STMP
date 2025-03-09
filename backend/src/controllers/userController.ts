import { Request, Response } from "express";
import { db } from "../db/index";
import { usersTable } from "../db/schema";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { 
    userid, 
    name, 
    email, 
    role, 
    department, 
    extrainfo, 
    password, 
    status 
  } = req.params; // Access data from URL parameters

  if (!userid || !name || !email || !role || !password || !status) {
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
      UserID: parseInt(userid), // Ensure UserID is a number
      UserName: name, 
      Email: email,
      Role: role as "Supervisor" | "Student" | "Training Representative",
      DepartmentOrMajor: department,  // Adding the new column for DepartmentOrMajor
      ExtraInfo: extrainfo,                  // Adding the new column for ExtraInfo
      Password: password,
      Status: status,
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