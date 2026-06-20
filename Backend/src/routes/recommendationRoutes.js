import express from "express";
import {
  createRecommendations,
  getRecommendationsByUser,
} from "../controllers/recommendationController.js";

const router = express.Router();
router.post("/", createRecommendations);
router.get("/user/:userId", getRecommendationsByUser);

export default router;
