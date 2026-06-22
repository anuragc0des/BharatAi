import express from "express";
import { sendChat, getChatHistory } from "../controllers/chatController.js";
import { validate } from "../middleware/validate.js";
import { chatSchema } from "../validation/schemas.js";

const router = express.Router();
router.post("/", validate(chatSchema), sendChat);
router.get("/:userId", getChatHistory);

export default router;
