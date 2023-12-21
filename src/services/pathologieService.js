import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/pathologies";

function PathologiesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getPathologies() {
  return http.get(apiEndpoint);
}

export function getPathologie(PathologiesId) {
  return http.get(PathologiesUrl(PathologiesId));
}

export async function savePathologie(Pathologies) {
  if (Pathologies._id) {
    if (getPathologie(Pathologies._id)) {
      const body = { ...Pathologies };
      delete body._id;

      return http.put(PathologiesUrl(Pathologies._id), body);
    } else return http.post(apiEndpoint, Pathologies);
  }
  return http.post(apiEndpoint, Pathologies);
}

export function deletePathologie(PathologiesId) {
  return http.delete(PathologiesUrl(PathologiesId));
}
