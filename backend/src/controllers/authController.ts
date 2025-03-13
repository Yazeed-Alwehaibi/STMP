import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db"; // Adjust based on your setup
import { usersTable } from "../db/schema/users"; // Adjust the import
import { eq } from "drizzle-orm";


const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

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
    const token = jwt.sign(
        { userId: user[0].UserID, email: user[0].Email, role: user[0].Role },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    // ✅ Send user data in response
    res.json({
        message: "Login successful",
        user: {
            id: user[0].UserID,
            email: user[0].Email,
            role: user[0].Role, // ✅ Now included in response
        },
        token, // Optional
    });
};


export const logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
