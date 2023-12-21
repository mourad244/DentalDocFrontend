import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/devis";

function deviUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getDevis() {
  return http.get(apiEndpoint);
}

export function getDevi(deviId) {
  return http.get(deviUrl(deviId));
}

export async function saveDevi(devi) {
  if (devi._id) {
    if (getDevi(devi._id)) {
      const body = { ...devi };
      delete body._id;

      return http.put(deviUrl(devi._id), body);
    } else return http.post(apiEndpoint, devi);
  }
  return http.post(apiEndpoint, devi);
}

export function deleteDevi(deviId) {
  return http.delete(deviUrl(deviId));
}
