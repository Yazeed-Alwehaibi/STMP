import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";




dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" })); // Allow frontend access
app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); // Parses incoming JSON data


app.use('/api', userRoutes);
app.use("/api", authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Backend for Summer Training Management System is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


