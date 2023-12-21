import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/searchpatient";

export function searchPatient(searchQuery) {
  return http.get(apiEndpoint + "?search=" + searchQuery);
}
