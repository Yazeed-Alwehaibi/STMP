import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import exampleRouter from './routes/exampleRoute';

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/example', exampleRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Backend for Summer Training Management System is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
