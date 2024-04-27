import React, { useState, useEffect } from "react";

import SearchBox from "../../../common/searchBox";
import ArticlesTable from "../../../common/articlesTable";
import ClipLoader from "react-spinners/ClipLoader";
import { getLots } from "../../../services/pharmacie/lotService";
import { getUniteMesures } from "../../../services/pharmacie/uniteMesureService";
import { getUniteReglementaires } from "../../../services/pharmacie/uniteReglementaireService";
import { getArticles } from "../../../services/pharmacie/articleService";

function ArticleSearch() {
  const [loading, setLoading] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [lots, setLots] = useState([]);
  const [sortColumn, setSortColumn] = useState({
    path: "nom",
    order: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [startSearch, setStartSearch] = useState(false);
  const fields = [
    { order: 1, name: "select", label: "Select", isActivated: false },
    { order: 2, name: "nom", label: "Nom" },
    { order: 3, name: "code", label: "Code" },
    { order: 4, name: "lotId", label: "Lot" },
    { order: 5, name: "stockInitial", label: "Stock Initial" },
    { order: 6, name: "stockAlerte", label: "Stock Alerte" },
    { order: 7, name: "uniteMesureId", label: "Unite Mesure" },
    { order: 8, name: "uniteReglementaireId", label: "Unite Reglementaire" },
    { order: 9, name: "prixHT", label: "Prix HT" },
    { order: 10, name: "tauxTVA", label: "Taux TVA" },
    { order: 11, name: "isExpiration", label: "Expiration" },
    { order: 12, name: "prixTTC", label: "Prix TTC" },
    { order: 13, name: "stockActuel", label: "Stock Actuel" },
  ];
  const selectedFields = [
    { order: 1, name: "select", label: "Select", isActivated: false },
    { order: 2, name: "nom", label: "Nom" },
    { order: 3, name: "code", label: "Code" },
    { order: 9, name: "uniteMesureId", label: "Unite Mesure" },
    { order: 10, name: "uniteReglementaireId", label: "Unite Reglementaire" },
    { order: 11, name: "isExpiration", label: "Expiration" },
    { order: 12, name: "prixTTC", label: "Prix TTC" },
    { order: 13, name: "stockActuel", label: "Stock Actuel" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let { data: lots } = await getLots();

      lots = lots.map((lot) => {
        return { ...lot, isSelected: false };
      });
      setLots(lots);
      setLoading(false);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchArtilces = async () => {
      let selectedLots = lots.filter((lot) => lot.isSelected);
      let selectedLotsIds = selectedLots.map((lot) => lot._id);
      if (selectedLotsIds.length === 0 && searchQuery === "")
        return setArticles([]);
      setLoadingArticles(true);
      let {
        data: { data: newArticles },
      } = await getArticles({
        sortColumn: sortColumn.path,
        order: sortColumn.order,
        searchQuery,
        selectedLots: selectedLotsIds,
      });
      setArticles(newArticles);
      setLoadingArticles(false);
    };
    fetchArtilces();
  }, [startSearch, lots]);
  const handleSelectLot = (e, lot) => {
    const index = lots.indexOf(lot);
    lots[index] = { ...lot };
    lots[index].isSelected = e.target.checked;
    setLots(lots);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSelectArticle = (article) => {};
  return (
    <div className="mb-2  flex flex-row items-start">
      <div className="flex w-[30%] min-w-[320px]  flex-col rounded-md bg-[#F2F2F2]">
        <p className="mb-2 rounded-md bg-[#4F6874] p-2 text-base font-bold text-white">
          1. Recherche des articles
        </p>
        <div className="mb-2 flex">
          <p className="m-2 mt-2 w-fit text-sm font-bold text-[#151516]">
            a. chercher l'article
          </p>
          <SearchBox
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onSearch={() => setStartSearch(true)}
          />
        </div>
        <div className="mb-2 mr-2 flex  flex-wrap ">
          <p className="m-2 mt-2 w-full text-sm font-bold text-[#151516]">
            b. Sélectionner les lots des articles
          </p>
          {lots.map((lot) => {
            return (
              <div className={"mx-2  flex  w-max"} key={lot._id}>
                <input
                  type="checkbox"
                  name={lot.nom}
                  id={lot.nom}
                  className="mx-1"
                  checked={lot.isSelected}
                  onChange={(e) => handleSelectLot(e, lot)}
                />
                <div className="items-center text-xs font-bold leading-9 text-[#1f2037]">
                  <label htmlFor="">{lot.nom}</label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mx-2 flex  min-w-[320px] flex-wrap rounded-md bg-[#4F6874]">
        <p className="m-2 mt-2 w-full text-base font-bold text-white">
          2. Sélectionner les arcticles à commander
        </p>
        {loadingArticles ? (
          <div className="m-auto my-4">
            <ClipLoader loading={loadingArticles} size={70} />
          </div>
        ) : articles.length > 0 ? (
          <ArticlesTable
            articles={articles}
            sortColumn={sortColumn}
            onSort={handleSort}
            fields={fields}
            datas={datas}
            headers={selectedFields}
            totalItems={articles.length}
            onItemSelect={this.handleSelectArticle}
            selectedItems={data.articles}
            displayTableControlPanel={false}
            displayItemActions={false}
          />
        ) : (
          <div className="ml-4 ">
            <p className="text-center text-sm font-bold text-slate-900">
              Aucun article trouvé
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleSearch;
