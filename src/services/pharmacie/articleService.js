import http from "../httpService";
// import { apiUrl } from "../config.json";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/articles";

function articleUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getArticles({
  currentPage,
  pageSize,
  sortColumn,
  order,
  searchQuery,
  selectedLots,
}) {
  return http.get(
    `${apiEndpoint}?${currentPage ? `&currentPage=${currentPage}` : ""}${
      pageSize ? `&pageSize=${pageSize}` : ""
    }${sortColumn ? `&sortColumn=${sortColumn}` : ""}${
      order ? `&order=${order}` : ""
    }${searchQuery ? `&searchQuery=${searchQuery}` : ""}${
      selectedLots ? `&selectedLots=${selectedLots}` : ""
    }`,
  );
  // return http.get(
  //   `${apiEndpoint}?currentPage=${currentPage}&pageSize=${pageSize}&sortColumn=${sortColumn}&order=${order}&searchQuery=${searchQuery}&selectedLots=${selectedLots}`,
  // );
  /*   return http.get(apiEndpoint); */
}

export function getArticle(articleId) {
  return http.get(articleUrl(articleId));
}

export async function saveArticle(article) {
  if (article._id) {
    if (getArticle(article._id)) {
      const body = { ...article };
      delete body._id;
      return http.put(articleUrl(article._id), body);
    } else return http.post(apiEndpoint, article);
  }
  return http.post(apiEndpoint, article);
}

export function deleteArticle(articleId) {
  return http.delete(articleUrl(articleId));
}
