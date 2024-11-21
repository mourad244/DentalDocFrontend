import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/uniteMesures";

function uniteMesureUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUniteMesures() {
  return http.get(apiEndpoint);
}

export function getUniteMesure(uniteMesureId) {
  return http.get(uniteMesureUrl(uniteMesureId));
}

export async function saveUniteMesure(uniteMesure) {
  if (uniteMesure._id) {
    if (getUniteMesure(uniteMesure._id)) {
      const body = { ...uniteMesure };
      delete body._id;
      return http.put(uniteMesureUrl(uniteMesure._id), body);
    } else return http.post(apiEndpoint, uniteMesure);
  }
  return http.post(apiEndpoint, uniteMesure);
}

export function deleteUniteMesure(uniteMesureId) {
  return http.delete(uniteMesureUrl(uniteMesureId));
}
