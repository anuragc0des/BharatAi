const MODELS_FALLBACK = [
  "google/gemma-4-31b-it:free",
  "openrouter/free",
  "openrouter/auto"
];

const FALLBACK_KEYS = [];

export const getApiKeys = () => {
  const keysStr = process.env.OPENROUTER_API_KEYS || "";
  const keys = keysStr.split(",").map(k => k.trim()).filter(Boolean);
  const singleKey = process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.trim() : "";
  if (singleKey && !keys.includes(singleKey)) {
    keys.push(singleKey);
  }
  FALLBACK_KEYS.forEach(k => {
    if (!keys.includes(k)) {
      keys.push(k);
    }
  });
  return keys;
};

export const callOpenRouterWithFallback = async (messages, initialModel = "google/gemma-4-31b-it:free") => {
  const keys = getApiKeys();
  const models = [initialModel, ...MODELS_FALLBACK.filter(m => m !== initialModel)];

  for (const model of models) {
    for (const key of keys) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5002",
            "X-Title": "BharatAI",
          },
          body: JSON.stringify({
            model,
            messages
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return data.choices[0].message.content;
        } else {
          throw new Error("Invalid response format from OpenRouter");
        }
      } catch (err) {
        console.error(`Failed OpenRouter call with key ...${key.slice(-6)} and model ${model}:`, err.message);
      }
    }
  }

  throw new Error("All OpenRouter API keys and fallback models failed.");
};

export const parseJsonFromLlm = (content) => {
  const cleaned = content.trim();
  if (!cleaned) throw new Error("Empty LLM content");

  // Try standard JSON.parse first
  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  // Clean markdown code blocks
  if (cleaned.includes("```")) {
    const parts = cleaned.split("```");
    for (let i = 1; i < parts.length; i += 2) {
      let part = parts[i].trim();
      if (part.startsWith("json")) {
        part = part.slice(4).trim();
      }
      try {
        return JSON.parse(part);
      } catch (e) {}
    }
  }

  // Find boundaries
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (e) {}
  }

  const startArr = cleaned.indexOf("[");
  const endArr = cleaned.lastIndexOf("]");
  if (startArr !== -1 && endArr !== -1 && endArr > startArr) {
    try {
      return JSON.parse(cleaned.slice(startArr, endArr + 1));
    } catch (e) {}
  }

  throw new Error("Could not parse JSON from LLM response");
};
