import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/medicaments";

function medicamentUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMedicaments() {
  return http.get(apiEndpoint);
}

export function getMedicament(medicamentId) {
  return http.get(medicamentUrl(medicamentId));
}

export async function saveMedicament(medicament) {
  if (medicament._id) {
    if (getMedicament(medicament._id)) {
      const body = { ...medicament };
      delete body._id;

      return http.put(medicamentUrl(medicament._id), body);
    } else return http.post(apiEndpoint, medicament);
  }
  return http.post(apiEndpoint, medicament);
}

export function deleteMedicament(medicamentId) {
  return http.delete(medicamentUrl(medicamentId));
}
