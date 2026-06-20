import express from "express";
import cors from "cors";
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
app.use(cors());
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

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await connectDB();
    await seedSchemes();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
