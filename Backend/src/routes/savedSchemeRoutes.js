import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  saveScheme,
  getSavedSchemes,
  removeSavedScheme,
} from "../controllers/savedSchemeController.js";
import { validate } from "../middleware/validate.js";
import { savedSchemeSchema } from "../validation/schemas.js";

const router = express.Router();
router.use(authMiddleware);
router.post("/", validate(savedSchemeSchema), saveScheme);
router.get("/", getSavedSchemes);
router.delete("/:schemeId", removeSavedScheme);

export default router;
