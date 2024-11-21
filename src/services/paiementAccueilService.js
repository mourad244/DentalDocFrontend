import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/paiementsaccueil";

export function getPaiementsAccueil() {
  return http.get(apiEndpoint);
}
