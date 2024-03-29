import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import ArticlesTable from "./articlesTable";
import { deleteArticle } from "../../../services/pharmacie/articleService";
import { getUniteMesures } from "../../../services/pharmacie/uniteMesureService";
import { getUniteReglementaires } from "../../../services/pharmacie/uniteReglementaireService";
import { getArticlesListWithPagination } from "../../../services/pharmacie/articleListPaginateService";

import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { BsPersonAdd } from "react-icons/bs";
import SearchBox from "../../../common/searchBox";
import ClipLoader from "react-spinners/ClipLoader";
import { getLots } from "../../../services/pharmacie/lotService";

function Articles() {
  const [datas, setDatas] = useState({
    uniteMesures: [],
    uniteReglementaires: [],
    lots: [],
  });
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortColumn, setSortColumn] = useState({
    path: "nom",
    order: "desc",
  });
  const [startSearch, setStartSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFields, setSelectedFields] = useState([
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "nom", label: "Nom" },
    { order: 3, name: "code", label: "Code" },
    { order: 4, name: "lotId", label: "Lot" },
    { order: 5, name: "stockInitial", label: "Stock Initial" },
    { order: 6, name: "stockAlerte", label: "Stock Alerte" },
    { order: 7, name: "stockActuel", label: "Stock Actuel" },
    { order: 8, name: "uniteMesureId", label: "Unite Mesure" },
    { order: 9, name: "uniteReglementaireId", label: "Unite Reglementaire" },
    { order: 10, name: "prixHT", label: "Prix HT" },
    { order: 11, name: "tauxTVA", label: "Taux TVA" },
    { order: 12, name: "prixTTC", label: "Prix TTC" },
    { order: 13, name: "isExpiration", label: "Expiration" },
  ]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [selectedFilterItems, setSelectedFilterItems] = useState({
    isExpiration: undefined,
    lotId: "",
  });
  const fields = [
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "nom", label: "Nom" },
    { order: 3, name: "code", label: "Code" },
    { order: 4, name: "lotId", label: "Lot" },
    { order: 5, name: "stockInitial", label: "Stock Initial" },
    { order: 6, name: "stockAlerte", label: "Stock Alerte" },
    { order: 7, name: "stockActuel", label: "Stock Actuel" },
    { order: 8, name: "uniteMesureId", label: "Unite Mesure" },
    { order: 9, name: "uniteReglementaireId", label: "Unite Reglementaire" },
    { order: 10, name: "prixHT", label: "Prix HT" },
    { order: 11, name: "tauxTVA", label: "Taux TVA" },
    { order: 12, name: "prixTTC", label: "Prix TTC" },
    { order: 13, name: "isExpiration", label: "Expiration" },
  ];

  const pageSize = 8;
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: uniteMesuresData } = await getUniteMesures();
      const { data: uniteReglementairesData } = await getUniteReglementaires();
      const { data: lotsData } = await getLots();
      setDatas({
        uniteMesures: uniteMesuresData,
        uniteReglementaires: uniteReglementairesData,
        lots: lotsData,
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {
          data: { data, totalCount },
        } = await getArticlesListWithPagination({
          pageSize,
          currentPage,
          searchQuery,
          order: sortColumn.order,
          sortColumn: sortColumn.path,
        });
        setArticles(data);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      if (startSearch) setCurrentPage(1);
      setLoading(false);
      setStartSearch(false);
    };

    fetchData();
  }, [currentPage, startSearch /* , searchQuery */, sortColumn]);
  const onChangeSearchQuery = (e) => {
    setSearchQuery(e);
  };

  const onSearch = () => {
    setStartSearch(true);
  };
  const handleSelectField = (field) => {
    const selectedFieldsA = [...selectedFields];
    const index = selectedFieldsA.findIndex(
      (f) => f.name.toString() === field.name.toString(),
    );
    if (index === -1) selectedFieldsA.push(field);
    else selectedFieldsA.splice(index, 1);
    selectedFieldsA.sort((a, b) => a.order - b.order);
    setSelectedFields(selectedFieldsA);
  };

  const onFilterChange = (name, e) => {
    let value = "";
    switch (e.target.value) {
      case "oui":
        value = true;
        break;
      case "non":
        value = false;
        break;
      default:
        break;
    }
    const newSelectedFilterItems = { ...selectedFilterItems };
    let newArticles = [...articles];
    if (name === "isExpiration") {
      if (value === "") newArticles = [...articles];
      else newArticles = articles.filter((p) => p.isExpiration === value);
    }
    newSelectedFilterItems[name] = value;
    setSelectedFilterItems(newSelectedFilterItems);
    setCurrentPage(1);
  };
  const handleSelectArticle = (article) => {
    let newSelectedArticles = [...selectedArticles];

    const index = newSelectedArticles.findIndex(
      (c) => c._id.toString() === article._id.toString(),
    );
    if (index === -1) newSelectedArticles.push(article);
    else newSelectedArticles.splice(index, 1);
    let selectedArticle = null;
    let founded = articles.find(
      (p) => p._id.toString() === article._id.toString(),
    );
    if (founded && newSelectedArticles.length === 1) selectedArticle = founded;
    setSelectedArticles(newSelectedArticles);
    setSelectedArticle(
      newSelectedArticles.length === 1 ? selectedArticle : null,
    );
  };

  const handleSelectArticles = () => {
    let newSelectedArticles =
      selectedArticles.length === articles.length ? [] : [...articles];
    setSelectedArticles(newSelectedArticles);
    setSelectedArticle(
      newSelectedArticles.length === 1 ? newSelectedArticles[0] : null,
    );
  };

  const handleEdit = () => {
    history.push(`/articles/${selectedArticle._id}`);
  };

  const handleDelete = async (items) => {
    const originalArticles = [...articles];
    try {
      await Promise.all(items.map((item) => deleteArticle(item._id)));
      const updatedArticles = originalArticles.filter(
        (article) => !items.some((item) => item._id === article._id),
      );
      setArticles(updatedArticles);
      setSelectedArticle(null);
      setSelectedArticles([]);
      toast.success("article(s) supprimé(s)");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("article déja supprimé");
      } else {
        toast.error("Une erreur est survenue lors de la suppression");
      }
      setArticles(originalArticles);
    }
  };

  const handlePageClick = (event) => {
    const newCurrentPage = event.selected + 1;
    setSelectedArticle(null);
    setSelectedArticles([]);
    setCurrentPage(newCurrentPage);
  };

  const handleSort = (column) => {
    setSortColumn(column);
  };

  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white ">
      <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste des articles
      </p>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/articles/new");
          }}
        >
          <BsPersonAdd className="mr-1" />
          Nouveau article
        </button>
      </div>
      <div className="ml-2 mt-2">
        <div className="m-2 flex min-w-fit  rounded-sm bg-[#83BCCD] pb-2  pt-2 shadow-md ">
          <div className="mr-3 h-[40px] w-28 text-right text-xs font-bold leading-9 text-[#72757c]">
            Chercher un article
          </div>
          <div className="flex w-fit items-start ">
            <SearchBox
              value={searchQuery}
              onChange={onChangeSearchQuery}
              onSearch={onSearch}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="m-auto my-4">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2">
          <ArticlesTable
            articles={articles}
            sortColumn={sortColumn}
            onSort={handleSort}
            fields={fields}
            datas={datas}
            selectedFilterItems={selectedFilterItems}
            onValueChange={onFilterChange}
            headers={selectedFields}
            onFieldSelect={handleSelectField}
            totalItems={articles.length}
            onItemSelect={handleSelectArticle}
            onItemsSelect={handleSelectArticles}
            selectedItems={selectedArticles}
            selectedItem={selectedArticle}
            onPrint={() => {
              console.log("print");
            }}
            onEdit={selectedArticle ? handleEdit : undefined}
            onDelete={
              selectedArticle !== null || selectedArticles.length !== 0
                ? handleDelete
                : undefined
            }
          />
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={">"}
            breakClassName={"break-me"}
            pageCount={Math.max(1, Math.ceil(totalCount / pageSize))} // Ensure at least 1 page
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            forcePage={Math.min(
              currentPage - 1,
              Math.ceil(totalCount / pageSize) - 1,
            )}
            onPageChange={handlePageClick}
            // className="w-max-[92%] mx-3 my-auto flex  w-fit list-none justify-evenly rounded-lg bg-[#D6E1E3] p-3 font-bold text-white"
            previousLabel={"<"}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
          />
        </div>
      )}
    </div>
  );
}

export default Articles;
