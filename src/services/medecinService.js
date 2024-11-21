import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/medecins";

function medecinUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMedecins() {
  return http.get(apiEndpoint);
}

export function getMedecin(medecinId) {
  return http.get(medecinUrl(medecinId));
}

export async function saveMedecin(medecin) {
  if (medecin._id) {
    if (getMedecin(medecin._id)) {
      const body = { ...medecin };
      delete body._id;

      return http.put(medecinUrl(medecin._id), body);
    } else return http.post(apiEndpoint, medecin);
  }
  return http.post(apiEndpoint, medecin);
}

export function deleteMedecin(medecinId) {
  return http.delete(medecinUrl(medecinId));
}
