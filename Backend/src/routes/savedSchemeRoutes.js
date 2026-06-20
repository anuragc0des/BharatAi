import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  saveScheme,
  getSavedSchemes,
  removeSavedScheme,
} from "../controllers/savedSchemeController.js";

const router = express.Router();
router.use(authMiddleware);
router.post("/", saveScheme);
router.get("/", getSavedSchemes);
router.delete("/:schemeId", removeSavedScheme);

export default router;
