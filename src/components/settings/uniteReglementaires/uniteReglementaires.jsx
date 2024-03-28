import React, { useState, useEffect } from "react";

import {
  getUniteReglementaires,
  deleteUniteReglementaire,
} from "../../../services/pharmacie/uniteReglementaireService";

import UniteReglementaireForm from "./uniteReglementaireForm";
import UniteReglementairesTable from "./uniteReglementairesTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function UniteReglementaires(props) {
  const [uniteReglementaires, setUniteReglementaires] = useState([]);
  const [filteredUniteReglementaires, setFilteredUniteReglementaires] =
    useState([]);

  const [selectedUniteReglementaire, setSelectedUniteReglementaire] =
    useState(null);
  const [selectedUniteReglementaires, setSelectedUniteReglementaires] =
    useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [displayForm, setDisplayForm] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [filterDisplay, setFilterDisplay] = useState(false);

  const [sortColumn, setSortColumn] = useState({ path: "nom", order: "desc" });
  const [totalCount, setTotalCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      const { data: uniteReglementaires } = await getUniteReglementaires();
      setUniteReglementaires(uniteReglementaires);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = uniteReglementaires;
    const getData = async () => {
      if (searchQuery)
        filtered = uniteReglementaires.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredUniteReglementaires(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (uniteReglementaires.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    itemOffset,
    uniteReglementaires,
    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalUniteReglementaires = uniteReglementaires;
    setUniteReglementaires(
      uniteReglementaires.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedUniteReglementaire(null);
    setSelectedUniteReglementaires([]);
    try {
      items.forEach(async (item) => {
        await deleteUniteReglementaire(item._id);
      });
      toast.success("unité réglementaire supprimée");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("unite réglementaire déja supprimée");
      setUniteReglementaires(originalUniteReglementaires);
    }
  };
  const handleSelectUniteReglementaire = (uniteReglementaire) => {
    let newSelectedUniteReglementaires = [...selectedUniteReglementaires];

    const index = newSelectedUniteReglementaires.findIndex(
      (c) => c._id.toString() === uniteReglementaire._id.toString(),
    );
    if (index === -1) newSelectedUniteReglementaires.push(uniteReglementaire);
    else newSelectedUniteReglementaires.splice(index, 1);
    let selectedUniteReglementaire = null;
    let founded = uniteReglementaires.find(
      (p) => p._id.toString() === uniteReglementaire._id.toString(),
    );
    if (founded && newSelectedUniteReglementaires.length === 1)
      selectedUniteReglementaire = founded;
    setSelectedUniteReglementaires(newSelectedUniteReglementaires);
    setSelectedUniteReglementaire(
      newSelectedUniteReglementaires.length === 1
        ? selectedUniteReglementaire
        : null,
    );
    setDisplayForm(false);
  };
  const handleSelectUniteReglementaires = () => {
    let newSelectedUniteReglementaires =
      selectedUniteReglementaires.length === filteredUniteReglementaires.length
        ? []
        : [...filteredUniteReglementaires];
    setSelectedUniteReglementaires(newSelectedUniteReglementaires);
    setSelectedUniteReglementaire(
      newSelectedUniteReglementaires.length === 1
        ? newSelectedUniteReglementaires[0]
        : null,
    );
  };
  const handlePageClick = (event) => {
    const newOffset = (event.selected * pageSize) % totalCount;
    setItemOffset(newOffset);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const toggleFilter = () => {
    setFilterDisplay(!filterDisplay);
  };
  const updateData = () => {
    setDataUpdated(true);
    setSelectedUniteReglementaire(null);
    setSelectedUniteReglementaires([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedUniteReglementaire(null);
    setSelectedUniteReglementaires([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouvelle unité réglementaire
        </button>
        <UniteReglementaireForm
          selectedUniteReglementaire={selectedUniteReglementaire}
          formToggle={toggleForm}
          updateData={updateData}
          formDisplay={displayForm}
        />
        {!filterDisplay ? (
          <button
            onClick={toggleFilter}
            className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          >
            <svg className="mr-2" width="15" height="15" fill="none">
              <rect width="15" height="15" rx="3" fill="#ffffff" />
              <path
                d="M3 9V7H6.5V3.5H8.5V7H12.5V9H8.5V13H6.5V9H3Z"
                fill="#4F6874"
              />
            </svg>
            Critère de recherche
          </button>
        ) : (
          <div className="w-full min-w-fit  rounded-md        bg-white  pb-2 shadow-component  ">
            <button
              onClick={toggleFilter}
              className=" mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
            >
              <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15">
                <rect width="15" height="15" rx="3" fill="#ffffff" />
                <path d="M3 9V7H12.5V9H3Z" fill="#4F6874" />
              </svg>
              Critère de recherche
            </button>

            <div className="m-3">
              <SearchBox
                value={searchQuery}
                onChange={handleSearch}
                label={"Objet de l'unite réglementaire"}
              />
            </div>
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucune unité réglementaire trouvée
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <button
        className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
        onClick={toggleForm}
      >
        + Nouvelle unité réglementaire
      </button>
      <UniteReglementaireForm
        selectedUniteReglementaire={selectedUniteReglementaire}
        formToggle={toggleForm}
        updateData={updateData}
        formDisplay={displayForm}
      />

      {!filterDisplay ? (
        <button
          onClick={toggleFilter}
          className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
        >
          <svg className="mr-2" width="15" height="15" fill="none">
            <rect width="15" height="15" rx="3" fill="#ffffff" />
            <path
              d="M3 9V7H6.5V3.5H8.5V7H12.5V9H8.5V13H6.5V9H3Z"
              fill="#4F6874"
            />
          </svg>
          Critère de recherche
        </button>
      ) : (
        <div className="w-full min-w-fit  rounded-md        bg-white  pb-2 shadow-component  ">
          <button
            onClick={toggleFilter}
            className=" mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          >
            <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15">
              <rect width="15" height="15" rx="3" fill="#ffffff" />
              <path d="M3 9V7H12.5V9H3Z" fill="#4F6874" />
            </svg>
            Critère de recherche
          </button>
          <div className="m-3">
            <SearchBox
              value={searchQuery}
              onChange={handleSearch}
              label={"Objet du uniteReglementaire"}
            />
          </div>
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des unité réglementaires
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des uniteReglementaires</button> */}
        <div className="m-2">
          <UniteReglementairesTable
            uniteReglementaires={filteredUniteReglementaires}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectUniteReglementaire}
            onItemsSelect={handleSelectUniteReglementaires}
            selectedItem={selectedUniteReglementaire}
            selectedItems={selectedUniteReglementaires}
            onEdit={selectedUniteReglementaire ? handleEdit : undefined}
            onDelete={
              selectedUniteReglementaire !== null ||
              selectedUniteReglementaires.length !== 0
                ? handleDelete
                : undefined
            }
          />
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={">"}
            breakClassName={"break-me"}
            pageCount={Math.ceil(totalCount / pageSize)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            // className="w-max-[92%] mx-3 my-auto flex  w-fit list-none justify-evenly rounded-lg bg-[#D6E1E3] p-3 font-bold text-white"
            previousLabel={"<"}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
          />
        </div>
      </div>
    </>
  );
}

export default UniteReglementaires;
