import SavedScheme from "../models/SavedScheme.js";
import Scheme from "../models/Scheme.js";
import { translateScheme } from "../services/translationService.js";

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
  const { lang } = req.query;
  const saved = await SavedScheme.find({ userId: req.user._id }).populate(
    "schemeId",
  );
  const schemes = saved.map((item) => item.schemeId);
  if (lang === "hi") {
    const translated = await Promise.all(
      schemes.map((s) => translateScheme(s, lang))
    );
    return res.json(translated);
  }
  res.json(schemes);
};

export const removeSavedScheme = async (req, res) => {
  const { schemeId } = req.params;
  await SavedScheme.findOneAndDelete({ userId: req.user._id, schemeId });
  res.json({ message: "Scheme removed" });
};
