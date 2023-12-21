import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/rdvs";

function rdvUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getRdvs() {
  return http.get(apiEndpoint);
}

export function getRdv(rdvId) {
  return http.get(rdvUrl(rdvId));
}

export async function saveRdv(rdv) {
  if (rdv._id) {
    if (getRdv(rdv._id)) {
      const body = { ...rdv };
      delete body._id;

      return http.put(rdvUrl(rdv._id), body);
    } else return http.post(apiEndpoint, rdv);
  }
  return http.post(apiEndpoint, rdv);
}

export function deleteRdv(rdvId) {
  return http.delete(rdvUrl(rdvId));
}
