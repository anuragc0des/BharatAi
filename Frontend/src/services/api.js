import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Extract validation messages if available
      const errMsg = payload.message || (payload.errors && payload.errors.map(e => e.message).join(", ")) || "Server error";
      toast.error(errMsg);
      throw new Error(errMsg);
    }

    return payload;
  } catch (error) {
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      toast.error("Network error: Unable to connect to the backend server.");
    } else if (!error.message || error.message === "Server error") {
      toast.error(error.message || "An unexpected error occurred.");
    }
    throw error;
  }
};

export { request };

export const getMyProfile = (authUserId) =>
  request(`/users/me?authUserId=${authUserId}`);

export const createUserProfile = (profileData) =>
  request("/users", {
    method: "POST",
    body: JSON.stringify(profileData),
  });

export const getRecommendationsByUser = (userId) =>
  request(`/recommendations/user/${userId}`);
export const createRecommendations = (userId) =>
  request("/recommendations", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
export const getSmartRecommendations = (userId, lang) =>
  request("/recommendations/smart", {
    method: "POST",
    body: JSON.stringify({ userId, lang }),
  });
export const evaluateEligibility = (userId, schemeId, lang) =>
  request("/recommendations/evaluate", {
    method: "POST",
    body: JSON.stringify({ userId, schemeId, lang }),
  });
export const getSchemeById = (schemeId) => request(`/schemes/${schemeId}`);
export const getAllSchemes = () => request("/schemes");
export const simplifySchemeText = (schemeId, lang) => request(`/schemes/${schemeId}/simplify?lang=${lang}`);
export const sendChatMessage = (payload) =>
  request("/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const getChatHistory = (userId) => request(`/chat/${userId}`);
export const loginUser = (credentials) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
export const registerUser = (credentials) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
export const logoutUser = () =>
  request("/auth/logout", {
    method: "POST",
  });
