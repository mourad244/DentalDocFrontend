import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/servicearmes";

function serviceArmeUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getServiceArmes() {
  return http.get(apiEndpoint);
}

export function getServiceArme(serviceArmeId) {
  return http.get(serviceArmeUrl(serviceArmeId));
}

export async function saveServiceArme(serviceArme) {
  if (serviceArme._id) {
    if (getServiceArme(serviceArme._id)) {
      const body = { ...serviceArme };
      delete body._id;

      return http.put(serviceArmeUrl(serviceArme._id), body);
    } else return http.post(apiEndpoint, serviceArme);
  }
  return http.post(apiEndpoint, serviceArme);
}

export function deleteServiceArme(serviceArmeId) {
  return http.delete(serviceArmeUrl(serviceArmeId));
}
