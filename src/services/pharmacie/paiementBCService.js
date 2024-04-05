import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/paiementbcs";

function paiementBCUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getPaiementBCs() {
  return http.get(apiEndpoint);
}

export function getPaiementBC(paiementBCId) {
  return http.get(paiementBCUrl(paiementBCId));
}

export async function savePaiementBC(paiementBC) {
  if (paiementBC._id) {
    if (getPaiementBC(paiementBC._id)) {
      const body = { ...paiementBC };
      delete body._id;

      return http.put(paiementBCUrl(paiementBC._id), body);
    } else return http.post(apiEndpoint, paiementBC);
  }
  return http.post(apiEndpoint, paiementBC);
}

export function deletePaiementBC(paiementBCId) {
  return http.delete(paiementBCUrl(paiementBCId));
}
