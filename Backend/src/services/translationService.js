import { callOpenRouterWithFallback, parseJsonFromLlm } from "../utils/openrouter.js";

const translationCache = new Map();

export const translateScheme = async (scheme, lang) => {
  if (!lang || lang === "en" || !scheme) return scheme;
  
  const schemeId = scheme._id ? String(scheme._id) : scheme.schemeName;
  const cacheKey = `${schemeId}_${lang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const payload = {
      schemeName: scheme.schemeName,
      category: scheme.category,
      description: scheme.description,
      benefits: scheme.benefits,
      eligibility: scheme.eligibility,
      requiredDocuments: scheme.requiredDocuments,
      applicationProcess: scheme.applicationProcess
    };

    const messages = [
      {
        role: "system",
        content: "You are a professional translator. Translate all string values in the provided JSON object to natural, clear Hindi (Devanagari script). Maintain the exact same JSON structure, and do not translate the JSON keys. Respond only with the translated JSON object. Never include markdown code fences or other text."
      },
      {
        role: "user",
        content: JSON.stringify(payload)
      }
    ];

    const content = await callOpenRouterWithFallback(messages);
    const translatedData = parseJsonFromLlm(content);
    
    // Merge back with original fields (like _id, officialLink, state, etc.)
    const originalObj = scheme.toObject ? scheme.toObject() : scheme;
    const result = {
      ...originalObj,
      ...translatedData
    };

    translationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Translation failed for scheme:", schemeId, error);
    // Fallback to original scheme
    return scheme;
  }
};
