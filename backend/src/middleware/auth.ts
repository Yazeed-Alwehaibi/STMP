import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use env variables!

export interface AuthRequest extends Request {
    user?: { systemID: string; email: string };
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies.token; // Read token from cookies

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string; email: string; systemID: string };
        req.user = { systemID: decoded.systemID, email: decoded.email };
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};
