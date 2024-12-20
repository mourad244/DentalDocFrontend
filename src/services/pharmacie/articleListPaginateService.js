import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = import.meta.env.VITE_API_URL;
const apiEndpoint = apiUrl + "/articleslistpaginate";

export function getArticlesListWithPagination({
  currentPage,
  pageSize,
  sortColumn,
  order,
  searchQuery,
  selectedLots,
}) {
  return http.get(
    `${apiEndpoint}?currentPage=${currentPage}&pageSize=${pageSize}&sortColumn=${sortColumn}&order=${order}&searchQuery=${searchQuery}
    &selectedLots=${selectedLots}`,
  );
}
