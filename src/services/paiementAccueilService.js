import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/paiementsaccueil";

export function getPaiementsAccueil() {
  return http.get(apiEndpoint);
}
