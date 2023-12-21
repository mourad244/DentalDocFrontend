import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/natureActes";

function NatureActesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getNatureActes() {
  return http.get(apiEndpoint);
}

export function getNatureActe(NatureActesId) {
  return http.get(NatureActesUrl(NatureActesId));
}

export async function saveNatureActe(NatureActes) {
  if (NatureActes._id) {
    if (getNatureActe(NatureActes._id)) {
      const body = { ...NatureActes };
      delete body._id;

      return http.put(NatureActesUrl(NatureActes._id), body);
    } else return http.post(apiEndpoint, NatureActes);
  }
  return http.post(apiEndpoint, NatureActes);
}

export function deleteNatureActe(NatureActesId) {
  return http.delete(NatureActesUrl(NatureActesId));
}
