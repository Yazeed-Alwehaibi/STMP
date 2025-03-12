import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../db";
import { usersTable } from "../db/schema/users";
import { eq } from "drizzle-orm";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use env variables

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user in database
    const user = await db.select().from(usersTable).where(eq(usersTable.Email, email)).limit(1);
    if (!user.length) {
        res.status(401).json({ message: "User not found" });
        return;
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user[0].Password);
    if (!validPassword) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    // Generate JWT
    const token = jwt.sign({ userId: user[0].UserID, email: user[0].Email }, SECRET_KEY, { expiresIn: "1h" });

    // Set HTTP-only cookie
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    res.json({ message: "Login successful" });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
