import React, { useState, useEffect } from "react";

import {
  getSocietes,
  deleteSociete,
} from "../../../services/pharmacie/societeService";

import SocieteForm from "./societeForm";
import SocietesTable from "./societesTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function Societes(props) {
  const [societes, setSocietes] = useState([]);
  const [filteredSocietes, setFilteredSocietes] = useState([]);

  const [selectedSociete, setSelectedSociete] = useState(null);
  const [selectedSocietes, setSelectedSocietes] = useState([]);

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
      const { data: societes } = await getSocietes();
      setSocietes(societes);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = societes;
    const getData = async () => {
      if (searchQuery)
        filtered = societes.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredSocietes(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (societes.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    itemOffset,
    societes,
    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalSocietes = societes;
    setSocietes(
      societes.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedSociete(null);
    setSelectedSocietes([]);
    try {
      items.forEach(async (item) => {
        await deleteSociete(item._id);
      });
      toast.success("unité réglementaire supprimée");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("unite réglementaire déja supprimée");
      setSocietes(originalSocietes);
    }
  };
  const handleSelectSociete = (societe) => {
    let newSelectedSocietes = [...selectedSocietes];

    const index = newSelectedSocietes.findIndex(
      (c) => c._id.toString() === societe._id.toString(),
    );
    if (index === -1) newSelectedSocietes.push(societe);
    else newSelectedSocietes.splice(index, 1);
    let selectedSociete = null;
    let founded = societes.find(
      (p) => p._id.toString() === societe._id.toString(),
    );
    if (founded && newSelectedSocietes.length === 1) selectedSociete = founded;
    setSelectedSocietes(newSelectedSocietes);
    setSelectedSociete(
      newSelectedSocietes.length === 1 ? selectedSociete : null,
    );
    setDisplayForm(false);
  };
  const handleSelectSocietes = () => {
    let newSelectedSocietes =
      selectedSocietes.length === filteredSocietes.length
        ? []
        : [...filteredSocietes];
    setSelectedSocietes(newSelectedSocietes);
    setSelectedSociete(
      newSelectedSocietes.length === 1 ? newSelectedSocietes[0] : null,
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
    setSelectedSociete(null);
    setSelectedSocietes([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedSociete(null);
    setSelectedSocietes([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouvelle société
        </button>
        <SocieteForm
          selectedSociete={selectedSociete}
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
          <div className="w-full min-w-fit  rounded-md bg-white  pb-2 shadow-component  ">
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
                label={"Nom de la société"}
              />
            </div>
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucune société trouvée
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
        + Nouvelle société
      </button>
      <SocieteForm
        selectedSociete={selectedSociete}
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
        <div className="w-full min-w-fit  rounded-md bg-white  pb-2 shadow-component  ">
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
              label={"Objet de la société"}
            />
          </div>
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des sociétés
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des societes</button> */}
        <div className="m-2">
          <SocietesTable
            societes={filteredSocietes}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectSociete}
            onItemsSelect={handleSelectSocietes}
            selectedItem={selectedSociete}
            selectedItems={selectedSocietes}
            onEdit={selectedSociete ? handleEdit : undefined}
            onDelete={
              selectedSociete !== null || selectedSocietes.length !== 0
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

export default Societes;
