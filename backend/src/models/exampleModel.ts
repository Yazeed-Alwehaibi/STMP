import pool from '../config/db';

export const fetchExampleData = async () => {
  const result = await pool.query('SELECT * FROM student');
  return result.rows;
};
