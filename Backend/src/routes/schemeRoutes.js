import express from "express";
import {
  getAllSchemes,
  getSchemeById,
  simplifyScheme
} from "../controllers/schemeController.js";

const router = express.Router();
router.get("/", getAllSchemes);
router.get("/:id", getSchemeById);
router.get("/:id/simplify", simplifyScheme);

export default router;
