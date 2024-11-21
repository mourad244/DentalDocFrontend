import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/rdvs";

function rdvUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getRdvs(date) {
  if (date) return http.get(apiEndpoint + "?date=" + date);
  return http.get(apiEndpoint);
}
// export function getRdvs() {
// }
export function getRdv(rdvId) {
  return http.get(rdvUrl(rdvId));
}
export function getPatientRdvs(patientId) {
  return http.get(apiEndpoint + "/patient/" + patientId);
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
