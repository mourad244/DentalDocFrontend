import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/paiements";

function paiementUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getPaiements() {
  return http.get(apiEndpoint);
}

export function getPaiement(paiementId) {
  return http.get(paiementUrl(paiementId));
}

export async function savePaiement(paiement) {
  if (paiement._id) {
    if (getPaiement(paiement._id)) {
      const body = { ...paiement };
      delete body._id;

      return http.put(paiementUrl(paiement._id), body);
    } else return http.post(apiEndpoint, paiement);
  }
  return http.post(apiEndpoint, paiement);
}

export function deletePaiement(paiementId) {
  return http.delete(paiementUrl(paiementId));
}
