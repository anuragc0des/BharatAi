import Recommendation from "../models/Recommendation.js";
import Scheme from "../models/Scheme.js";
import User from "../models/User.js";

const getMatchScore = (user, scheme) => {
  let score = 0;
  const explanation = [];

  if (user.annualIncome < 300000) {
    score += 25;
    explanation.push("your annual income is below ₹3 lakh");
  }

  if (user.studentStatus.toLowerCase() === "yes") {
    score += 25;
    explanation.push("you are a student");
  }

  if (user.farmerStatus.toLowerCase() === "yes") {
    score += 20;
    explanation.push("you are a farmer");
  }

  if (user.category.toLowerCase() !== "general") {
    score += 15;
    explanation.push(`you belong to ${user.category} category`);
  }

  if (scheme.category.toLowerCase() === user.category.toLowerCase()) {
    score += 15;
    explanation.push(`the scheme is designed for ${user.category} category`);
  }

  return {
    score: Math.min(score, 100),
    explanation: explanation.join(" and "),
  };
};

export const createRecommendations = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const schemes = await Scheme.find();
  const recommendations = [];

  for (const scheme of schemes) {
    const { score, explanation } = getMatchScore(user, scheme);
    if (score >= 30) {
      const recommendation = await Recommendation.create({
        userId: user._id,
        schemeId: scheme._id,
        matchScore: score,
        explanation: `You qualify because ${explanation}.`,
      });
      recommendations.push({
        id: recommendation._id,
        scheme,
        matchScore: recommendation.matchScore,
        explanation: recommendation.explanation,
      });
    }
  }

  res.json(recommendations);
};

export const getRecommendationsByUser = async (req, res) => {
  const { userId } = req.params;
  const recommendations = await Recommendation.find({ userId })
    .sort({ createdAt: -1 })
    .populate("schemeId");

  const response = recommendations.map((rec) => ({
    id: rec._id,
    scheme: rec.schemeId,
    matchScore: rec.matchScore,
    explanation: rec.explanation,
  }));

  res.json(response);
};
