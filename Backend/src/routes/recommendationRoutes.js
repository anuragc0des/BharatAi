import express from "express";
import {
  createRecommendations,
  getRecommendationsByUser,
  generateSmartRecommendations,
  evaluateEligibility
} from "../controllers/recommendationController.js";
import { validate } from "../middleware/validate.js";
import { recommendationSchema } from "../validation/schemas.js";

const router = express.Router();
router.post("/", validate(recommendationSchema), createRecommendations);
router.post("/smart", validate(recommendationSchema), generateSmartRecommendations);
router.post("/evaluate", evaluateEligibility); // add schema validation if needed later
router.get("/user/:userId", getRecommendationsByUser);

export default router;
