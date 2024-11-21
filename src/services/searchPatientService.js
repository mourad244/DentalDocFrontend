import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/searchpatient";

export function searchPatient(searchQuery) {
  return http.get(apiEndpoint + "?search=" + searchQuery);
}
