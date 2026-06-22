import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { authSchema } from "../validation/schemas.js";

const router = express.Router();
router.post("/register", validate(authSchema), register);
router.post("/login", validate(authSchema), login);
router.post("/logout", logout);

export default router;
