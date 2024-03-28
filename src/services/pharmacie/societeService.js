import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/societes";

function societeUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getSocietes() {
  return http.get(apiEndpoint);
}

export function getSociete(societeId) {
  return http.get(societeUrl(societeId));
}

export async function saveSociete(societe) {
  if (societe._id) {
    if (getSociete(societe._id)) {
      const body = { ...societe };
      delete body._id;
      return http.put(societeUrl(societe._id), body);
    } else return http.post(apiEndpoint, societe);
  }
  return http.post(apiEndpoint, societe);
}

export function deleteSociete(societeId) {
  return http.delete(societeUrl(societeId));
}
