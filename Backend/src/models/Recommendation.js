import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
    required: true,
  },
  matchScore: { type: Number, required: true },
  explanation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);
export default Recommendation;
