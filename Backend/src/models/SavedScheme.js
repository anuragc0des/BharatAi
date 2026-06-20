import mongoose from "mongoose";

const savedSchemeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthUser",
    required: true,
  },
  schemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const SavedScheme = mongoose.model("SavedScheme", savedSchemeSchema);
export default SavedScheme;
