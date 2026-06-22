import { request } from "./api.js";

export const getSavedSchemes = (lang) => request(`/saved-schemes?lang=${lang || ""}`);
export const saveScheme = (schemeId) =>
  request("/saved-schemes", {
    method: "POST",
    body: JSON.stringify({ schemeId }),
  });
export const removeSavedScheme = (schemeId) =>
  request(`/saved-schemes/${schemeId}`, {
    method: "DELETE",
  });
