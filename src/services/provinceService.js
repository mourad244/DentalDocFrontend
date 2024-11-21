import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/provinces";

function provinceUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProvinces() {
  return http.get(apiEndpoint);
}

export function getProvince(provinceId) {
  return http.get(provinceUrl(provinceId));
}

export async function saveProvince(province) {
  if (province._id) {
    if (getProvince(province._id)) {
      const body = { ...province };
      delete body._id;
      return http.put(provinceUrl(province._id), body);
    } else return http.post(apiEndpoint, province);
  }
  return http.post(apiEndpoint, province);
}

export function deleteProvince(provinceId) {
  return http.delete(provinceUrl(provinceId));
}
