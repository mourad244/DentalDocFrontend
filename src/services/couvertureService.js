import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;

const apiEndpoint = apiUrl + "/couvertures";
function couvertureUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getCouvertures() {
  return http.get(apiEndpoint);
}

export function getCouverture(couvertureId) {
  return http.get(couvertureUrl(couvertureId));
}

export async function saveCouverture(couverture) {
  if (couverture._id) {
    if (getCouverture(couverture._id)) {
      const body = { ...couverture };
      delete body._id;

      return http.put(couvertureUrl(couverture._id), body);
    } else return http.post(apiEndpoint, couverture);
  }
  return http.post(apiEndpoint, couverture);
}

export function deleteCouverture(couvertureId) {
  return http.delete(couvertureUrl(couvertureId));
}
