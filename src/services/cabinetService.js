import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/cabinets";

function cabinetUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getCabinets() {
  return http.get(apiEndpoint);
}

export function getCabinet(cabinetId) {
  return http.get(cabinetUrl(cabinetId));
}

export async function saveCabinet(cabinet) {
  if (cabinet._id) {
    if (getCabinet(cabinet._id)) {
      const body = { ...cabinet };
      delete body._id;

      return http.put(cabinetUrl(cabinet._id), body);
    } else return http.post(apiEndpoint, cabinet);
  }
  return http.post(apiEndpoint, cabinet);
}

export function deleteCabinet(cabinetId) {
  return http.delete(cabinetUrl(cabinetId));
}
