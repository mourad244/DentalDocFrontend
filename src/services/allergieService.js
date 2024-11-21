import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/allergies";

function allergieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getAllergies() {
  return http.get(apiEndpoint);
}

export function getAllergie(allergieId) {
  return http.get(allergieUrl(allergieId));
}

export async function saveAllergie(allergie) {
  if (allergie._id) {
    if (getAllergie(allergie._id)) {
      const body = { ...allergie };
      delete body._id;

      return http.put(allergieUrl(allergie._id), body);
    } else return http.post(apiEndpoint, allergie);
  }
  return http.post(apiEndpoint, allergie);
}

export function deleteAllergie(allergieId) {
  return http.delete(allergieUrl(allergieId));
}
