import Recommendation from "../models/Recommendation.js";
import Scheme from "../models/Scheme.js";
import User from "../models/User.js";
import { getRecommendations } from "../services/recommendationService.js";
import { translateScheme } from "../services/translationService.js";

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

// New Smart Recommendation Endpoint using Python ML and OpenRouter LLM
export const generateSmartRecommendations = async (req, res) => {
  try {
    const { userId, lang } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare user profile for Python script (all fields for maximum accuracy)
    const userProfile = {
      userId: user._id,
      age: user.age,
      gender: user.gender,
      maritalStatus: user.maritalStatus || "Single",
      state: user.state,
      district: user.district || "",
      residenceType: user.residenceType || "Urban",
      education: user.education,
      occupation: user.occupation,
      annualIncome: user.annualIncome,
      bplStatus: user.bplStatus || "No",
      rationCardType: user.rationCardType || "None",
      category: user.category,
      religion: user.religion || "Not Specified",
      minority: user.minority || "No",
      disabilityStatus: user.disabilityStatus || "No",
      disabilityPercentage: user.disabilityPercentage || 0,
      studentStatus: user.studentStatus,
      farmerStatus: user.farmerStatus,
      entrepreneurStatus: user.entrepreneurStatus,
      employmentStatus: user.employmentStatus,
      seniorCitizen: user.seniorCitizen || "No",
      exServiceman: user.exServiceman || "No",
      constructionWorker: user.constructionWorker || "No",
      landOwnership: user.landOwnership || "No",
      landSizeAcres: user.landSizeAcres || 0,
    };

    // Call the Python ML / LLM service
    const smartResults = await getRecommendations(userProfile, lang);

    if (lang === "hi" && smartResults.top_ml_matches) {
      smartResults.top_ml_matches = await Promise.all(
        smartResults.top_ml_matches.map((s) => translateScheme(s, lang))
      );
    }

    return res.status(200).json({
      success: true,
      data: smartResults
    });
  } catch (error) {
    console.error("Smart Recommendation Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to generate smart recommendations", 
      details: error.message 
    });
  }
};

export const evaluateEligibility = async (req, res) => {
  try {
    const { userId, schemeId, lang } = req.body;
    if (!userId || !schemeId) {
      return res.status(400).json({ message: "userId and schemeId are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });

    const userProfile = {
      age: user.age,
      gender: user.gender,
      maritalStatus: user.maritalStatus || "Single",
      state: user.state,
      district: user.district || "",
      residenceType: user.residenceType || "Urban",
      education: user.education,
      occupation: user.occupation,
      annualIncome: user.annualIncome,
      bplStatus: user.bplStatus || "No",
      rationCardType: user.rationCardType || "None",
      category: user.category,
      religion: user.religion || "Not Specified",
      minority: user.minority || "No",
      disabilityStatus: user.disabilityStatus || "No",
      disabilityPercentage: user.disabilityPercentage || 0,
      studentStatus: user.studentStatus,
      farmerStatus: user.farmerStatus,
      entrepreneurStatus: user.entrepreneurStatus,
      employmentStatus: user.employmentStatus,
      seniorCitizen: user.seniorCitizen || "No",
      exServiceman: user.exServiceman || "No",
      constructionWorker: user.constructionWorker || "No",
      landOwnership: user.landOwnership || "No",
      landSizeAcres: user.landSizeAcres || 0,
    };

    const response = await fetch("http://127.0.0.1:5003/evaluate-eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_profile: userProfile, scheme, lang }),
    });

    if (!response.ok) {
      throw new Error(`Python service responded with status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Evaluate Eligibility Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to evaluate eligibility", 
      details: error.message 
    });
  }
};
