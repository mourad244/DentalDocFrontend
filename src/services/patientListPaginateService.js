import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/patientslistpaginate";

export function getPatientsListWithPagination({
  currentPage,
  pageSize,
  sortColumn,
  order,
  searchQuery,
}) {
  return http.get(
    `${apiEndpoint}?currentPage=${currentPage}&pageSize=${pageSize}&sortColumn=${sortColumn}&order=${order}&searchQuery=${searchQuery}`,
  );
}
