/* eslint-disable import/no-anonymous-default-export */
import jwtDecode from "jwt-decode";
import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/auth";
const tokenKey = "unsecureKey";

const jwt = getJwt();
if (jwt) {
  http.setJwt(jwt);
}

export async function login(nom, password) {
  const { data: jwt } = await http.post(apiEndpoint, { nom, password });
  sessionStorage.setItem(tokenKey, jwt);
  http.setJwt(jwt); // Set the JWT token after login
}

export function loginWithJwt(jwt) {
  sessionStorage.setItem(tokenKey, jwt);
  http.setJwt(jwt); // Set the JWT token after login with JWT
}

export function logout() {
  sessionStorage.removeItem(tokenKey);
  http.setJwt(null); // Remove the JWT token from http service
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
  console.log("getJwt", sessionStorage.getItem(tokenKey));
  return sessionStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};
