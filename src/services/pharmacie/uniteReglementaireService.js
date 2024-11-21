import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/uniteReglementaires";

function uniteReglementaireUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUniteReglementaires() {
  return http.get(apiEndpoint);
}

export function getUniteReglementaire(uniteReglementaireId) {
  return http.get(uniteReglementaireUrl(uniteReglementaireId));
}

export async function saveUniteReglementaire(uniteReglementaire) {
  if (uniteReglementaire._id) {
    if (getUniteReglementaire(uniteReglementaire._id)) {
      const body = { ...uniteReglementaire };
      delete body._id;
      return http.put(uniteReglementaireUrl(uniteReglementaire._id), body);
    } else return http.post(apiEndpoint, uniteReglementaire);
  }
  return http.post(apiEndpoint, uniteReglementaire);
}

export function deleteUniteReglementaire(uniteReglementaireId) {
  return http.delete(uniteReglementaireUrl(uniteReglementaireId));
}
