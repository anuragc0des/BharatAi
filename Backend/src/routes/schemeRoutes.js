import express from "express";
import {
  getAllSchemes,
  getSchemeById,
} from "../controllers/schemeController.js";

const router = express.Router();
router.get("/", getAllSchemes);
router.get("/:id", getSchemeById);

export default router;
