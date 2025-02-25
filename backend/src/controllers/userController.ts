import { Request, Response } from "express";
import {db} from "../db/index";
import { usersTable } from "../db/schema";

// interface UserRequestBody {
//   name: string;
//   age: number;
//   email: string;
// }

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { name, age, email } = req.params; // Access data from the body

  if (!name || !age || !email) {
    res.status(400).json({ error: "Name, age, and email are required" });
    return;
  }

  try {
    const insertedUser = await db.insert(usersTable).values({ 
      name, 
      age: Number(age), // Ensure age is a number
      email 
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