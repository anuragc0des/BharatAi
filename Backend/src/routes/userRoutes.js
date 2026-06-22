import express from "express";
import {
  createUserProfile,
  getUserProfile,
  listUsers,
  getMyProfile,
} from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import { userProfileSchema } from "../validation/schemas.js";

const router = express.Router();
router.post("/", validate(userProfileSchema), createUserProfile);
router.get("/", listUsers);
router.get("/me", getMyProfile);
router.get("/:id", getUserProfile);

export default router;
