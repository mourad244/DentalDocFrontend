import React, { useState, useEffect } from "react";

import {
  getNatureActes,
  deleteNatureActe,
} from "../../../services/natureActeService";

import NatureActeForm from "./natureActeForm";
import NatureActesTable from "./natureActesTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function NatureActes(props) {
  const [itemOffset, setItemOffset] = useState(0);
  const [natureActes, setNatureActes] = useState([]);
  const [filteredNatureActes, setFilteredNatureActes] = useState([]);
  const [selectedNatureActe, setSelectedNatureActe] = useState(null);
  const [selectedNatureActes, setSelectedNatureActes] = useState([]);

  const [filterDisplay, setFilterDisplay] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [displayForm, setDisplayForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState({ path: "nom", order: "desc" });
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 10;
  useEffect(() => {
    const fetchData = async () => {
      const { data: natureActes } = await getNatureActes();
      setNatureActes(natureActes);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = natureActes;
    const getData = async () => {
      if (searchQuery)
        filtered = natureActes.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

      const endOffset = itemOffset + pageSize;
      setFilteredNatureActes(sorted.slice(itemOffset, endOffset));
    };
    if (natureActes.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    natureActes,
    searchQuery,
    itemOffset,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalNatureActes = natureActes;
    setNatureActes(
      natureActes.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedNatureActe(null);
    setSelectedNatureActes([]);
    try {
      items.forEach(async (item) => {
        await deleteNatureActe(item._id);
      });
      toast.success("natureActe supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("natureActe déja supprimé");
      setNatureActes(originalNatureActes);
    }
  };
  const handleSelectNatureActe = (natureActe) => {
    let newSelectedNatureActes = [...selectedNatureActes];

    const index = newSelectedNatureActes.findIndex(
      (c) => c._id.toString() === natureActe._id.toString(),
    );
    if (index === -1) newSelectedNatureActes.push(natureActe);
    else newSelectedNatureActes.splice(index, 1);
    let selectedNatureActe = null;
    let founded = natureActes.find(
      (p) => p._id.toString() === natureActe._id.toString(),
    );
    if (founded && newSelectedNatureActes.length === 1)
      selectedNatureActe = founded;
    setSelectedNatureActes(newSelectedNatureActes);
    setSelectedNatureActe(
      newSelectedNatureActes.length === 1 ? selectedNatureActe : null,
    );
    setDisplayForm(false);
  };
  const handleSelectNatureActes = () => {
    let newSelectedNatureActes =
      selectedNatureActes.length === filteredNatureActes.length
        ? []
        : [...filteredNatureActes];
    setSelectedNatureActes(newSelectedNatureActes);
    setSelectedNatureActe(
      newSelectedNatureActes.length === 1 ? newSelectedNatureActes[0] : null,
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
    setSelectedNatureActe(null);
    setSelectedNatureActes([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedNatureActe(null);
    setSelectedNatureActes([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouvelle natureActe
        </button>
        <NatureActeForm
          selectedNatureActe={selectedNatureActe}
          formToggle={toggleForm}
          updateData={updateData}
          formDisplay={displayForm}
        />
        {!filterDisplay ? (
          <button
            onClick={toggleFilter}
            className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          >
            <svg className="mr-2" width="15" height="15" fill="none">
              <rect width="15" height="15" rx="3" fill="#ffffff" />
              <path
                d="M3 9V7H6.5V3.5H8.5V7H12.5V9H8.5V13H6.5V9H3Z"
                fill="#455a94"
              />
            </svg>
            Critère de recherche
          </button>
        ) : (
          <div className="w-full min-w-fit  rounded-md        bg-white  pb-2 shadow-component  ">
            <button
              onClick={toggleFilter}
              className=" mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
            >
              <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15">
                <rect width="15" height="15" rx="3" fill="#ffffff" />
                <path d="M3 9V7H12.5V9H3Z" fill="#455a94" />
              </svg>
              Critère de recherche
            </button>

            <SearchBox
              value={searchQuery}
              onChange={handleSearch}
              label={"nom du natureActe"}
            />
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucune natureActe trouvée
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <button
        className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
        onClick={toggleForm}
      >
        + Nouvelle natureActe
      </button>
      <NatureActeForm
        selectedNatureActe={selectedNatureActe}
        formToggle={toggleForm}
        updateData={updateData}
        formDisplay={displayForm}
      />

      {!filterDisplay ? (
        <button
          onClick={toggleFilter}
          className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
        >
          <svg className="mr-2" width="15" height="15" fill="none">
            <rect width="15" height="15" rx="3" fill="#ffffff" />
            <path
              d="M3 9V7H6.5V3.5H8.5V7H12.5V9H8.5V13H6.5V9H3Z"
              fill="#455a94"
            />
          </svg>
          Critère de recherche
        </button>
      ) : (
        <div className="w-full min-w-fit  rounded-md        bg-white  pb-2 shadow-component  ">
          <button
            onClick={toggleFilter}
            className=" mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          >
            <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15">
              <rect width="15" height="15" rx="3" fill="#ffffff" />
              <path d="M3 9V7H12.5V9H3Z" fill="#455a94" />
            </svg>
            Critère de recherche
          </button>

          <SearchBox
            value={searchQuery}
            onChange={handleSearch}
            label={"Objet du natureActe"}
          />
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des natureActes
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des natureActes</button> */}
        <div className="m-2">
          <NatureActesTable
            natureActes={filteredNatureActes}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectNatureActe}
            onItemsSelect={handleSelectNatureActes}
            selectedItem={selectedNatureActe}
            selectedItems={selectedNatureActes}
            onEdit={selectedNatureActe ? handleEdit : undefined}
            onDelete={
              selectedNatureActe !== null || selectedNatureActes.length !== 0
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
            // className="w-max-[92%] mx-3 my-auto flex  w-fit list-none justify-evenly rounded-lg bg-[#5a6b99] p-3 font-bold text-white"
            previousLabel={"<"}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
          />
        </div>
      </div>
    </>
  );
}

export default NatureActes;
