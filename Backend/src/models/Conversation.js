import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
