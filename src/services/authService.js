/* eslint-disable import/no-anonymous-default-export */
import jwtDecode from "jwt-decode";
import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

setTimeout(() => {
  http.setJwt(getJwt());
}, 1000);
export async function login(nom, password) {
  const { data: jwt } = await http.post(apiEndpoint, { nom, password });
  sessionStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  sessionStorage.setItem(tokenKey, jwt);
}

export function logout() {
  sessionStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = sessionStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return sessionStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};
