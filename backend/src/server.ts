import express from "express";
import cors from "cors";
import trainingsRouter from "./routes/trainings"; // Import route
import authRoutes from "./routes/auth";


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Use API routes
app.use("/api/trainings", trainingsRouter); // Register route

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
