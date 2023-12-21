import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/regions";

function regionUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getRegions() {
  return http.get(apiEndpoint);
}

export function getRegion(regionId) {
  return http.get(regionUrl(regionId));
}

export async function saveRegion(region) {
  if (region._id) {
    if (getRegion(region._id)) {
      const body = { ...region };
      delete body._id;
      return http.put(regionUrl(region._id), body);
    } else return http.post(apiEndpoint, region);
  }
  return http.post(apiEndpoint, region);
}

export function deleteRegion(regionId) {
  return http.delete(regionUrl(regionId));
}
