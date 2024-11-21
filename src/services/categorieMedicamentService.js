import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/categorieMedicaments";

function categorieMedicamentUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getCategorieMedicaments() {
  return http.get(apiEndpoint);
}

export function getCategorieMedicament(categorieMedicamentId) {
  return http.get(categorieMedicamentUrl(categorieMedicamentId));
}

export async function saveCategorieMedicament(categorieMedicament) {
  if (categorieMedicament._id) {
    if (getCategorieMedicament(categorieMedicament._id)) {
      const body = { ...categorieMedicament };
      delete body._id;

      return http.put(categorieMedicamentUrl(categorieMedicament._id), body);
    } else return http.post(apiEndpoint, categorieMedicament);
  }
  return http.post(apiEndpoint, categorieMedicament);
}

export function deleteCategorieMedicament(categorieMedicamentId) {
  return http.delete(categorieMedicamentUrl(categorieMedicamentId));
}
