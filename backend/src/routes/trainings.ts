import { Router } from "express";
import { db } from "../db/index"; // Ensure correct path
import { usersTable } from "../db/schema/users";

const router = Router();

// GET all training applications
router.get("/", async (req, res) => {
  try {
    const trainings = await db.select().from(usersTable);
    res.json(trainings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching training applications" });
  }
});

export default router;
