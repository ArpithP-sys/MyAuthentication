import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongo.js";
import authrouter from "./routes/authroutes.js";
import { setMaxListeners } from 'events';

import userRouter from "./routes/userRoutes.js";

setMaxListeners(20); 
const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins=['http://localhost:5173'];
connectDB()
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials: true }));

// Api endpoint
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', authrouter);
app.use('/api/user',userRouter)

// Server listen
 app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  console.log("Visit http://localhost:" + PORT + " to access the API");
});

