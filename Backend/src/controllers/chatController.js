import Conversation from "../models/Conversation.js";

export const sendChat = async (req, res) => {
  const { userId, question, answer } = req.body;
  if (!userId || !question || !answer) {
    return res
      .status(400)
      .json({ message: "userId, question, and answer are required" });
  }

  const conversation = await Conversation.create({ userId, question, answer });
  res.status(201).json(conversation);
};

export const getChatHistory = async (req, res) => {
  const { userId } = req.params;
  const history = await Conversation.find({ userId }).sort({ timestamp: -1 });
  res.json(history);
};
