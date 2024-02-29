import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/patientslist";

export function getPatientsList() {
  return http.get(apiEndpoint);
}

export function getPatientsListWithPagination({
  currentPage,
  pageSize,
  sortColumn,
  searchQuery,
}) {
  return http.get(
    `${apiEndpoint}?currentPage=${currentPage}&pageSize=${pageSize}&sortColumn=${sortColumn}&searchQuery=${searchQuery}`,
  );
}
