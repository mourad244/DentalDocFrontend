import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/natureactes";

function natureActeUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getNatureActes() {
  return http.get(apiEndpoint);
}

export function getNatureActe(natureActeId) {
  return http.get(natureActeUrl(natureActeId));
}

export async function saveNatureActe(natureActe) {
  if (natureActe._id) {
    if (getNatureActe(natureActe._id)) {
      const body = { ...natureActe };
      delete body._id;

      return http.put(natureActeUrl(natureActe._id), body);
    } else return http.post(apiEndpoint, natureActe);
  }
  return http.post(apiEndpoint, natureActe);
}

export function deleteNatureActe(natureActeId) {
  return http.delete(natureActeUrl(natureActeId));
}
