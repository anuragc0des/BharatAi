import express from "express";
import { sendChat, getChatHistory } from "../controllers/chatController.js";

const router = express.Router();
router.post("/", sendChat);
router.get("/:userId", getChatHistory);

export default router;
