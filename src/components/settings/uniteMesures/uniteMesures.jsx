import React, { useState, useEffect } from "react";

import {
  getUniteMesures,
  deleteUniteMesure,
} from "../../../services/pharmacie/uniteMesureService";

import UniteMesureForm from "./uniteMesureForm";
import UniteMesuresTable from "./uniteMesuresTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function UniteMesures(props) {
  const [uniteMesures, setUniteMesures] = useState([]);
  const [filteredUniteMesures, setFilteredUniteMesures] = useState([]);

  const [selectedUniteMesure, setSelectedUniteMesure] = useState(null);
  const [selectedUniteMesures, setSelectedUniteMesures] = useState([]);

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
      const { data: uniteMesures } = await getUniteMesures();
      setUniteMesures(uniteMesures);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = uniteMesures;
    const getData = async () => {
      if (searchQuery)
        filtered = uniteMesures.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredUniteMesures(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (uniteMesures.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    itemOffset,
    uniteMesures,
    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalUniteMesures = uniteMesures;
    setUniteMesures(
      uniteMesures.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedUniteMesure(null);
    setSelectedUniteMesures([]);
    try {
      items.forEach(async (item) => {
        await deleteUniteMesure(item._id);
      });
      toast.success("unité de mesure supprimée");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("unite de mesure déja supprimée");
      setUniteMesures(originalUniteMesures);
    }
  };
  const handleSelectUniteMesure = (uniteMesure) => {
    let newSelectedUniteMesures = [...selectedUniteMesures];

    const index = newSelectedUniteMesures.findIndex(
      (c) => c._id.toString() === uniteMesure._id.toString(),
    );
    if (index === -1) newSelectedUniteMesures.push(uniteMesure);
    else newSelectedUniteMesures.splice(index, 1);
    let selectedUniteMesure = null;
    let founded = uniteMesures.find(
      (p) => p._id.toString() === uniteMesure._id.toString(),
    );
    if (founded && newSelectedUniteMesures.length === 1)
      selectedUniteMesure = founded;
    setSelectedUniteMesures(newSelectedUniteMesures);
    setSelectedUniteMesure(
      newSelectedUniteMesures.length === 1 ? selectedUniteMesure : null,
    );
    setDisplayForm(false);
  };
  const handleSelectUniteMesures = () => {
    let newSelectedUniteMesures =
      selectedUniteMesures.length === filteredUniteMesures.length
        ? []
        : [...filteredUniteMesures];
    setSelectedUniteMesures(newSelectedUniteMesures);
    setSelectedUniteMesure(
      newSelectedUniteMesures.length === 1 ? newSelectedUniteMesures[0] : null,
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
    setSelectedUniteMesure(null);
    setSelectedUniteMesures([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedUniteMesure(null);
    setSelectedUniteMesures([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouvelle unité de mesure
        </button>
        <UniteMesureForm
          selectedUniteMesure={selectedUniteMesure}
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
                label={"Objet de l'unite de mesure"}
              />
            </div>
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucune unité de mesure trouvée
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
        + Nouvelle unité de mesure
      </button>
      <UniteMesureForm
        selectedUniteMesure={selectedUniteMesure}
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
              label={"Objet du uniteMesure"}
            />
          </div>
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des unité de mesures
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des uniteMesures</button> */}
        <div className="m-2">
          <UniteMesuresTable
            uniteMesures={filteredUniteMesures}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectUniteMesure}
            onItemsSelect={handleSelectUniteMesures}
            selectedItem={selectedUniteMesure}
            selectedItems={selectedUniteMesures}
            onEdit={selectedUniteMesure ? handleEdit : undefined}
            onDelete={
              selectedUniteMesure !== null || selectedUniteMesures.length !== 0
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

export default UniteMesures;
