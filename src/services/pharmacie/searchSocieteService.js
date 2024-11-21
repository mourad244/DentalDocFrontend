import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/searchsociete";

export function searchSociete(searchQuery) {
  return http.get(apiEndpoint + "?search=" + searchQuery);
}
