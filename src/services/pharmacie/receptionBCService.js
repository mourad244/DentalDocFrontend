import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/receptionbcs";

function receptionBCUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getReceptionBCs() {
  return http.get(apiEndpoint);
}

export function getReceptionBC(receptionBCId) {
  return http.get(receptionBCUrl(receptionBCId));
}

export async function saveReceptionBC(receptionBC) {
  if (receptionBC._id) {
    if (getReceptionBC(receptionBC._id)) {
      const body = { ...receptionBC };
      delete body._id;

      return http.put(receptionBCUrl(receptionBC._id), body);
    } else return http.post(apiEndpoint, receptionBC);
  }
  return http.post(apiEndpoint, receptionBC);
}

export function deleteReceptionBC(receptionBCId) {
  return http.delete(receptionBCUrl(receptionBCId));
}
