import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/roles";

function roleUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getRoles() {
  return http.get(apiEndpoint);
}

export function getRole(roleId) {
  return http.get(roleUrl(roleId));
}

export async function saveRole(role) {
  if (role._id) {
    if (getRole(role._id)) {
      const body = { ...role };
      delete body._id;

      return http.put(roleUrl(role._id), body);
    } else return http.post(apiEndpoint, role);
  }
  return http.post(apiEndpoint, role);
}

export function deleteRole(roleId) {
  return http.delete(roleUrl(roleId));
}
