import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/searchsociete";

export function searchSociete(searchQuery) {
  return http.get(apiEndpoint + "?search=" + searchQuery);
}
