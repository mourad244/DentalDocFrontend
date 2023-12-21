import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/actedentaires";

function acteDentaireUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getActeDentaires() {
  return http.get(apiEndpoint);
}

export function getActeDentaire(acteDentaireId) {
  return http.get(acteDentaireUrl(acteDentaireId));
}

export async function saveActeDentaire(acteDentaire) {
  if (acteDentaire._id) {
    if (getActeDentaire(acteDentaire._id)) {
      const body = { ...acteDentaire };
      delete body._id;

      return http.put(acteDentaireUrl(acteDentaire._id), body);
    } else return http.post(apiEndpoint, acteDentaire);
  }
  return http.post(apiEndpoint, acteDentaire);
}

export function deleteActeDentaire(acteDentaireId) {
  return http.delete(acteDentaireUrl(acteDentaireId));
}
