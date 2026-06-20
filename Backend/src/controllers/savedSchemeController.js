import SavedScheme from "../models/SavedScheme.js";
import Scheme from "../models/Scheme.js";

export const saveScheme = async (req, res) => {
  const { schemeId } = req.body;
  if (!schemeId) {
    return res.status(400).json({ message: "schemeId is required" });
  }

  const existing = await SavedScheme.findOne({
    userId: req.user._id,
    schemeId,
  });
  if (existing) {
    return res.status(200).json({ message: "Scheme already saved" });
  }

  const saved = await SavedScheme.create({ userId: req.user._id, schemeId });
  res.status(201).json(saved);
};

export const getSavedSchemes = async (req, res) => {
  const saved = await SavedScheme.find({ userId: req.user._id }).populate(
    "schemeId",
  );
  res.json(saved.map((item) => item.schemeId));
};

export const removeSavedScheme = async (req, res) => {
  const { schemeId } = req.params;
  await SavedScheme.findOneAndDelete({ userId: req.user._id, schemeId });
  res.json({ message: "Scheme removed" });
};
