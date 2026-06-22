import Scheme from "../models/Scheme.js";
import { translateScheme } from "../services/translationService.js";

export const getAllSchemes = async (req, res) => {
  const { lang } = req.query;
  const schemes = await Scheme.find().sort({ schemeName: 1 });
  if (lang === "hi") {
    const translated = await Promise.all(
      schemes.map((s) => translateScheme(s, lang))
    );
    return res.json(translated);
  }
  res.json(schemes);
};

export const getSchemeById = async (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;
  const scheme = await Scheme.findById(id);
  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found" });
  }
  if (lang === "hi") {
    const translated = await translateScheme(scheme, lang);
    return res.json(translated);
  }
  res.json(scheme);
};

const fetchWithRetry = async (url, options = {}, retries = 5, backoff = 1500) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`[Connection Retry] Fetch to ${url} failed (attempt ${i + 1}/${retries}). Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }
};

export const simplifyScheme = async (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;
  const scheme = await Scheme.findById(id);
  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found" });
  }

  const scheme_text = `Name: ${scheme.schemeName}\nDescription: ${scheme.description}\nBenefits: ${scheme.benefits.join(" ")}\nEligibility: ${scheme.eligibility.join(" ")}`;

  try {
    const response = await fetchWithRetry("http://127.0.0.1:5003/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheme_text, lang }),
    });

    if (!response.ok) {
      const errDetail = await response.json().catch(() => ({}));
      throw new Error(`Python service responded with status: ${response.status} - ${JSON.stringify(errDetail)}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Simplification error:", error);
    res.status(500).json({ message: "Failed to simplify scheme", error: error.message });
  }
};
