import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/users";

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndpoint);
}

export function getUser(userId) {
  return http.get(userUrl(userId));
}

export async function saveUser(user) {
  if (user._id) {
    if (getUser(user._id)) {
      const body = { ...user };
      delete body._id;

      return http.put(userUrl(user._id), body);
    } else return http.post(apiEndpoint, user);
  }
  return http.post(apiEndpoint, user);
}

export function deleteUser(userId) {
  return http.delete(userUrl(userId));
}
