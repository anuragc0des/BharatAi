import Scheme from "../models/Scheme.js";

export const getAllSchemes = async (req, res) => {
  const schemes = await Scheme.find().sort({ schemeName: 1 });
  res.json(schemes);
};

export const getSchemeById = async (req, res) => {
  const { id } = req.params;
  const scheme = await Scheme.findById(id);
  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found" });
  }
  res.json(scheme);
};
