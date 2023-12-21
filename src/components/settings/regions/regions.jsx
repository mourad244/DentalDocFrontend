import React, { useState, useEffect } from "react";

import { getRegions, deleteRegion } from "../../../services/regionService";

import RegionForm from "./regionForm";
import RegionsTable from "./regionsTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function Regions(props) {
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [displayForm, setDisplayForm] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [filterDisplay, setFilterDisplay] = useState(false);

  const [sortColumn, setSortColumn] = useState({ path: "code", order: "desc" });
  const [totalCount, setTotalCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      const { data: regions } = await getRegions();
      setRegions(regions);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = regions;
    const getData = async () => {
      if (searchQuery)
        filtered = regions.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredRegions(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (regions.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    itemOffset,
    regions,
    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalRegions = regions;
    setRegions(
      regions.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedRegion(null);
    setSelectedRegions([]);
    try {
      items.forEach(async (item) => {
        await deleteRegion(item._id);
      });
      toast.success("région supprimée");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("region déja supprimée");
      setRegions(originalRegions);
    }
  };
  const handleSelectRegion = (region) => {
    let newSelectedRegions = [...selectedRegions];

    const index = newSelectedRegions.findIndex(
      (c) => c._id.toString() === region._id.toString(),
    );
    if (index === -1) newSelectedRegions.push(region);
    else newSelectedRegions.splice(index, 1);
    let selectedRegion = null;
    let founded = regions.find(
      (p) => p._id.toString() === region._id.toString(),
    );
    if (founded && newSelectedRegions.length === 1) selectedRegion = founded;
    setSelectedRegions(newSelectedRegions);
    setSelectedRegion(newSelectedRegions.length === 1 ? selectedRegion : null);
    setDisplayForm(false);
  };
  const handleSelectRegions = () => {
    let newSelectedRegions =
      selectedRegions.length === filteredRegions.length
        ? []
        : [...filteredRegions];
    setSelectedRegions(newSelectedRegions);
    setSelectedRegion(
      newSelectedRegions.length === 1 ? newSelectedRegions[0] : null,
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
    setSelectedRegion(null);
    setSelectedRegions([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedRegion(null);
    setSelectedRegions([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouvelle région
        </button>
        <RegionForm
          selectedRegion={selectedRegion}
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

            <div className="m-3">
              <SearchBox
                value={searchQuery}
                onChange={handleSearch}
                label={"Objet du region"}
              />
            </div>
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucune région trouvée
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
        + Nouvelle région
      </button>
      <RegionForm
        selectedRegion={selectedRegion}
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
          <div className="m-3">
            <SearchBox
              value={searchQuery}
              onChange={handleSearch}
              label={"Objet du region"}
            />
          </div>
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des régions
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des regions</button> */}
        <div className="m-2">
          <RegionsTable
            regions={filteredRegions}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectRegion}
            onItemsSelect={handleSelectRegions}
            selectedItem={selectedRegion}
            selectedItems={selectedRegions}
            onEdit={selectedRegion ? handleEdit : undefined}
            onDelete={
              selectedRegion !== null || selectedRegions.length !== 0
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

export default Regions;
