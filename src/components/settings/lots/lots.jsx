import React, { useState, useEffect } from "react";

import { getLots, deleteLot } from "../../../services/pharmacie/lotService";

import LotForm from "./lotForm";
import LotsTable from "./lotsTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function Lots(props) {
  const [lots, setLots] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);

  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedLots, setSelectedLots] = useState([]);

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
      const { data: lots } = await getLots();
      setLots(lots);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = lots;
    const getData = async () => {
      if (searchQuery)
        filtered = lots.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredLots(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (lots.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    itemOffset,
    lots,
    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalLots = lots;
    setLots(
      lots.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedLot(null);
    setSelectedLots([]);
    try {
      items.forEach(async (item) => {
        await deleteLot(item._id);
      });
      toast.success("lot supprimée");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("lot déja supprimée");
      setLots(originalLots);
    }
  };
  const handleSelectLot = (lot) => {
    let newSelectedLots = [...selectedLots];

    const index = newSelectedLots.findIndex(
      (c) => c._id.toString() === lot._id.toString(),
    );
    if (index === -1) newSelectedLots.push(lot);
    else newSelectedLots.splice(index, 1);
    let selectedLot = null;
    let founded = lots.find((p) => p._id.toString() === lot._id.toString());
    if (founded && newSelectedLots.length === 1) selectedLot = founded;
    setSelectedLots(newSelectedLots);
    setSelectedLot(newSelectedLots.length === 1 ? selectedLot : null);
    setDisplayForm(false);
  };
  const handleSelectLots = () => {
    let newSelectedLots =
      selectedLots.length === filteredLots.length ? [] : [...filteredLots];
    setSelectedLots(newSelectedLots);
    setSelectedLot(newSelectedLots.length === 1 ? newSelectedLots[0] : null);
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
    setSelectedLot(null);
    setSelectedLots([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedLot(null);
    setSelectedLots([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouveau lot
        </button>
        <LotForm
          selectedLot={selectedLot}
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
                label={"Objet du lot"}
              />
            </div>
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucun lot trouvé
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
        + Nouvelle lot
      </button>
      <LotForm
        selectedLot={selectedLot}
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
              label={"Objet du lot"}
            />
          </div>
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des lots
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des lots</button> */}
        <div className="m-2">
          <LotsTable
            lots={filteredLots}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectLot}
            onItemsSelect={handleSelectLots}
            selectedItem={selectedLot}
            selectedItems={selectedLots}
            onEdit={selectedLot ? handleEdit : undefined}
            onDelete={
              selectedLot !== null || selectedLots.length !== 0
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

export default Lots;
