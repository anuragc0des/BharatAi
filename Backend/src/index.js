import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import savedSchemeRoutes from "./routes/savedSchemeRoutes.js";
import seedSchemes from "./services/seedSchemes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/saved-schemes", savedSchemeRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5002;

const startPythonMicroservice = () => {
  const pythonPath = "python";
  const scriptDir = path.resolve(__dirname, "../python_scripts");
  
  console.log(`[FastAPI Startup] Spawning FastAPI microservice at ${scriptDir}...`);
  const uvicorn = spawn(
    pythonPath,
    ["-m", "uvicorn", "recommendation_service:app", "--host", "127.0.0.1", "--port", "5003"],
    {
      cwd: scriptDir,
      env: {
        ...process.env,
      },
    }
  );

  uvicorn.stdout.on("data", (data) => {
    console.log(`[FastAPI] ${data.toString().trim()}`);
  });

  uvicorn.stderr.on("data", (data) => {
    console.error(`[FastAPI Error] ${data.toString().trim()}`);
  });

  uvicorn.on("close", (code) => {
    console.log(`FastAPI microservice process exited with code ${code}`);
  });

  process.on("exit", () => {
    uvicorn.kill();
  });
};

const startServer = async () => {
  try {
    await connectDB();
    await seedSchemes();
    startPythonMicroservice();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
