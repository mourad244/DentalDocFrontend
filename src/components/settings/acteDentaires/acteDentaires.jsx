import React, { useState, useEffect } from "react";

import {
  getActeDentaires,
  deleteActeDentaire,
} from "../../../services/acteDentaireService";
import { getNatureActes } from "../../../services/natureActeService";

import ActeDentaireForm from "./acteDentaireForm";
import ActeDentairesTable from "./acteDentairesTable";

import SearchBox from "../../../common/searchBox";

import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { BsPersonAdd } from "react-icons/bs";

import _ from "lodash";

function ActeDentaires(props) {
  const [natureActes, setNatureActes] = useState([]);
  const [acteDentaires, setActeDentaires] = useState([]);
  const [filteredActeDentaires, setFilteredActeDentaires] = useState([]);

  const [selectedActeDentaire, setSelectedActeDentaire] = useState(null);
  const [selectedActeDentaires, setSelectedActeDentaires] = useState([]);

  const [dataUpdated, setDataUpdated] = useState(true);
  const [displayForm, setDisplayForm] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({ path: "nom", order: "desc" });

  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      const { data: natureActes } = await getNatureActes();
      setNatureActes(natureActes);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: acteDentaires } = await getActeDentaires();
      setActeDentaires(acteDentaires);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = acteDentaires;
    const getData = async () => {
      if (searchQuery)
        filtered = acteDentaires.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredActeDentaires(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (acteDentaires.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    acteDentaires,

    itemOffset,

    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalActeDentaires = acteDentaires;
    setActeDentaires(
      acteDentaires.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedActeDentaire(null);
    setSelectedActeDentaires([]);
    try {
      items.forEach(async (item) => {
        await deleteActeDentaire(item._id);
      });
      toast.success("acteDentaire supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("acteDentaire déja supprimé");
      setActeDentaires(originalActeDentaires);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * pageSize) % totalCount;
    setItemOffset(newOffset);
  };
  const handleSelectActeDentaire = (acteDentaire) => {
    let newSelectedActeDentaires = [...selectedActeDentaires];

    const index = newSelectedActeDentaires.findIndex(
      (c) => c._id.toString() === acteDentaire._id.toString(),
    );
    if (index === -1) newSelectedActeDentaires.push(acteDentaire);
    else newSelectedActeDentaires.splice(index, 1);
    let selectedActeDentaire = null;
    let founded = acteDentaires.find(
      (p) => p._id.toString() === acteDentaire._id.toString(),
    );
    if (founded && newSelectedActeDentaires.length === 1)
      selectedActeDentaire = founded;
    setSelectedActeDentaires(newSelectedActeDentaires);
    setSelectedActeDentaire(
      newSelectedActeDentaires.length === 1 ? selectedActeDentaire : null,
    );
    setDisplayForm(false);
  };
  const handleSelectActeDentaires = () => {
    let newSelectedActeDentaires =
      selectedActeDentaires.length === filteredActeDentaires.length
        ? []
        : [...filteredActeDentaires];
    setSelectedActeDentaires(newSelectedActeDentaires);
    setSelectedActeDentaire(
      newSelectedActeDentaires.length === 1
        ? newSelectedActeDentaires[0]
        : null,
    );
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
    setSelectedActeDentaire(null);
    setSelectedActeDentaires([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedActeDentaire(null);
    setSelectedActeDentaires([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          <BsPersonAdd className="mr-1" /> Nouveau acte dentaire
        </button>
        <ActeDentaireForm
          selectedActeDentaire={selectedActeDentaire}
          formToggle={toggleForm}
          updateData={updateData}
          natureActes={natureActes}
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

            <SearchBox
              value={searchQuery}
              onChange={handleSearch}
              label={"Nom de l'utilisateur"}
            />
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucun acte dentaire
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
        <BsPersonAdd className="mr-1" /> Nouveau acte dentaire
      </button>
      <ActeDentaireForm
        selectedActeDentaire={selectedActeDentaire}
        formToggle={toggleForm}
        natureActes={natureActes}
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

          <SearchBox
            value={searchQuery}
            onChange={handleSearch}
            label={"Objet du acteDentaire"}
          />
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des actes dentaires
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des acteDentaires</button> */}
        <div className="m-2">
          <ActeDentairesTable
            acteDentaires={filteredActeDentaires}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectActeDentaire}
            onItemsSelect={handleSelectActeDentaires}
            selectedItem={selectedActeDentaire}
            selectedItems={selectedActeDentaires}
            onEdit={selectedActeDentaire ? handleEdit : undefined}
            onDelete={
              selectedActeDentaire !== null ||
              selectedActeDentaires.length !== 0
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

export default ActeDentaires;
