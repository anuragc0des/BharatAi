import { callOpenRouterWithFallback } from "../utils/openrouter.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import Scheme from "../models/Scheme.js";

export const sendChat = async (req, res) => {
  const { userId, question, lang } = req.body;
  if (!userId || !question) {
    return res.status(400).json({ message: "userId and question are required" });
  }

  let userContext = "";
  if (userId && userId !== "guest-user") {
    try {
      const userProfile = await User.findOne({ authUserId: userId });
      if (userProfile) {
        // Exclude internal fields for cleaner context
        const { _id, authUserId, createdAt, __v, ...profileData } = userProfile.toObject();
        userContext = `\n\nHere is the current user's profile data. Use this context to personalize your answers and determine their eligibility:\n${JSON.stringify(profileData, null, 2)}`;
      }
    } catch (e) {
      console.error("Failed to load user profile for chat context:", e);
    }
  }

  let schemesContext = "";
  try {
    const allSchemes = await Scheme.find({}).select("schemeName category description _id");
    if (allSchemes && allSchemes.length > 0) {
      schemesContext = `\n\nCRITICAL INSTRUCTION: You MUST ONLY recommend government schemes from the EXACT list below. DO NOT invent schemes. DO NOT recommend external schemes. When mentioning a scheme, you MUST provide a markdown link to it using EXACTLY this format: [Scheme Name](/schemes/SCHEME_ID).\n\nDATABASE SCHEMES:\n` + 
        allSchemes.map(s => `- ID: ${s._id} | Name: ${s.schemeName} | Category: ${s.category} | Description: ${s.description}`).join('\n');
    }
  } catch (e) {
    console.error("Failed to load schemes for chat context:", e);
  }

  let answer = "";
  try {
    const systemInstruction = "You are BharatAI, an expert AI assistant that helps Indian citizens understand and discover government schemes, scholarships, and benefits. Be polite, concise, and highly accurate. If you don't know the answer, say so." + 
      (lang === "hi" ? "\n\nCRITICAL INSTRUCTION: You MUST respond entirely in Hindi (using clear, natural Hindi language and Devanagari script). Keep the tone respectful and helpful." : "") + 
      userContext + schemesContext;

    const messages = [
      {
        role: "system",
        content: systemInstruction
      },
      { role: "user", content: question }
    ];

    answer = await callOpenRouterWithFallback(messages);
  } catch (err) {
    console.error("Chat Error:", err);
    return res.status(500).json({ message: "Failed to generate AI response. Please try again." });
  }

  const conversation = await Conversation.create({ userId, question, answer });
  res.status(201).json(conversation);
};

export const getChatHistory = async (req, res) => {
  const { userId } = req.params;
  const history = await Conversation.find({ userId }).sort({ timestamp: -1 });
  res.json(history);
};
