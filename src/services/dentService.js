import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/dents";

function dentUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getDents() {
  return http.get(apiEndpoint);
}

export function getDent(dentId) {
  return http.get(dentUrl(dentId));
}

export async function saveDent(dent) {
  if (dent._id) {
    if (getDent(dent._id)) {
      const body = { ...dent };
      delete body._id;

      return http.put(dentUrl(dent._id), body);
    } else return http.post(apiEndpoint, dent);
  }
  return http.post(apiEndpoint, dent);
}

export function deleteDent(dentId) {
  return http.delete(dentUrl(dentId));
}
