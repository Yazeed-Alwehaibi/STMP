// src/app.ts
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import path from 'path';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import studentRoutes from './routes/studentRoutes';
import supervisor from './routes/supervisor';
import uploadRoutes from './routes/upload';
import rep from './routes/rep';

dotenv.config();
const app: Application = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use('/api', userRoutes);
app.use("/api", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", supervisor);
app.use("/api", uploadRoutes);
app.use("/api", rep);

app.get('/', (_req: Request, res: Response) => {
  res.send('Backend for Summer Training Management System is running!');
});

export default app;
export const PORT = process.env.PORT || 3000;
