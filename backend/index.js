import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongo.js";
import authrouter from "./routes/authroutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { setMaxListeners } from 'events';

setMaxListeners(20); 
const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

// ✅ Connect MongoDB
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Recommended CORS setup for dev + render deployment
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

// ✅ API routes
// app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', authrouter);
app.use('/api/user', userRouter);

// ✅ Serve frontend static files in production

  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });


// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`);
});
