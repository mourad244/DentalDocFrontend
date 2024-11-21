import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;

const apiEndpoint = apiUrl + "/patients";
function patientUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getPatients() {
  return http.get(apiEndpoint);
}

export function getPatient(patientId) {
  return http.get(patientUrl(patientId));
}

export async function savePatient(patient) {
  if (patient._id) {
    if (getPatient(patient._id)) {
      const body = { ...patient };
      delete body._id;

      return http.put(patientUrl(patient._id), body);
    } else return http.post(apiEndpoint, patient);
  }
  return http.post(apiEndpoint, patient);
}

export function deletePatient(patientId) {
  return http.delete(patientUrl(patientId));
}
