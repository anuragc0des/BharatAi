import crypto from 'crypto';

// In-memory cache for recommendation results
// Key format: `${userId}_${profileHash}`
const recommendationCache = new Map();

// Helper to generate a stable SHA-256 hash of the user profile object
const getProfileHash = (profile) => {
  if (!profile) return 'empty';
  const sortedProfile = Object.keys(profile)
    .sort()
    .reduce((acc, key) => {
      acc[key] = profile[key];
      return acc;
    }, {});
  return crypto.createHash('sha256').update(JSON.stringify(sortedProfile)).digest('hex');
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

export const getRecommendations = async (userProfile, lang = 'en') => {
  const profileWithLang = { ...userProfile, lang };
  const userId = userProfile.userId || userProfile._id || 'guest';
  const profileHash = getProfileHash(profileWithLang);
  const cacheKey = `${userId}_${profileHash}`;

  // Check in-memory cache
  if (recommendationCache.has(cacheKey)) {
    console.log(`[Cache Hit] Recommendations retrieved from cache for user ${userId} (${lang})`);
    return recommendationCache.get(cacheKey);
  }

  console.log(`[Cache Miss] Calling FastAPI recommendation microservice for user ${userId} (${lang})`);
  
  const response = await fetchWithRetry('http://127.0.0.1:5003/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileWithLang),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FastAPI microservice returned error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(`FastAPI microservice logic error: ${result.error}`);
  }

  // Store in cache
  recommendationCache.set(cacheKey, result);
  return result;
};
