import { Request, Response } from 'express';
import { fetchExampleData } from '../models/exampleModel';

export const getExampleData = async (req: Request, res: Response) => {
  try {
    const data = await fetchExampleData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
