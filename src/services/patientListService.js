import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/patientslist";

export function getPatientsList() {
  return http.get(apiEndpoint);
}
