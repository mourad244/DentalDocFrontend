import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/lots";

function lotUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getLots() {
  return http.get(apiEndpoint);
}

export function getLot(lotId) {
  return http.get(lotUrl(lotId));
}

export async function saveLot(lot) {
  if (lot._id) {
    if (getLot(lot._id)) {
      const body = { ...lot };
      delete body._id;
      return http.put(lotUrl(lot._id), body);
    } else return http.post(apiEndpoint, lot);
  }
  return http.post(apiEndpoint, lot);
}

export function deleteLot(lotId) {
  return http.delete(lotUrl(lotId));
}
