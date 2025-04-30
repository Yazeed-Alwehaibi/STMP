// middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten();
      res.status(400).json({ error: errors.fieldErrors });
      return; // Important! Stop further execution
    }
    next(); // ✅ Only next() without returning anything
  };
};
