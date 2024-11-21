import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;

const apiEndpoint = apiUrl + "/detailcouvertures";
function detailCouvertureUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getDetailCouvertures() {
  return http.get(apiEndpoint);
}

export function getDetailCouverture(detailCouvertureId) {
  return http.get(detailCouvertureUrl(detailCouvertureId));
}

export async function saveDetailCouverture(detailCouverture) {
  if (detailCouverture._id) {
    if (getDetailCouverture(detailCouverture._id)) {
      const body = { ...detailCouverture };
      delete body._id;

      return http.put(detailCouvertureUrl(detailCouverture._id), body);
    } else return http.post(apiEndpoint, detailCouverture);
  }
  return http.post(apiEndpoint, detailCouverture);
}

export function deleteDetailCouverture(detailCouvertureId) {
  return http.delete(detailCouvertureUrl(detailCouvertureId));
}
