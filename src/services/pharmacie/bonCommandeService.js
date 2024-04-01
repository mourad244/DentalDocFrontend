import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/boncommandes";

function bonCommandeUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getBonCommandes() {
  return http.get(apiEndpoint);
}

export function getBonCommande(bonCommandeId) {
  return http.get(bonCommandeUrl(bonCommandeId));
}

export async function saveBonCommande(bonCommande) {
  if (bonCommande._id) {
    if (getBonCommande(bonCommande._id)) {
      const body = { ...bonCommande };
      delete body._id;

      return http.put(bonCommandeUrl(bonCommande._id), body);
    } else return http.post(apiEndpoint, bonCommande);
  }
  return http.post(apiEndpoint, bonCommande);
}

export function deleteBonCommande(bonCommandeId) {
  return http.delete(bonCommandeUrl(bonCommandeId));
}
