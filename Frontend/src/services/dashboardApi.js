import { request } from "./api.js";

export const getSavedSchemes = () => request("/saved-schemes");
export const saveScheme = (schemeId) =>
  request("/saved-schemes", {
    method: "POST",
    body: JSON.stringify({ schemeId }),
  });
export const removeSavedScheme = (schemeId) =>
  request(`/saved-schemes/${schemeId}`, {
    method: "DELETE",
  });
