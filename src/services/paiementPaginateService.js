import http from "./httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/paiementspaginate";

export function getPaiements({
  time,
  date,
  currentPage,
  pageSize,
  sortColumn,
  order,
  searchQuery,
}) {
  if (time && date)
    return http.get(
      apiEndpoint +
        `?currentPage=${currentPage}&pageSize=${pageSize}&sortColumn=${sortColumn}&order=${order}&searchQuery=${searchQuery}&time=${time}&date=${date}`,
    );
  return http.get(
    `${apiEndpoint}?currentPage=${currentPage}&pageSize=${pageSize}&sortColumn=${sortColumn}&order=${order}&searchQuery=${searchQuery}`,
  );
}
