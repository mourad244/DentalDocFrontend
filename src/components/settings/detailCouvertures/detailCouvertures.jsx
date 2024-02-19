import React, { useState, useEffect } from "react";

import {
  getDetailCouvertures,
  deleteDetailCouverture,
} from "../../../services/detailCouvertureService";
import { getCouvertures } from "../../../services/couvertureService";

import DetailCouvertureForm from "./detailCouvertureForm";
import DetailCouverturesTable from "./detailCouverturesTable";

import SearchBox from "../../../common/searchBox";

import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { BsPersonAdd } from "react-icons/bs";

import _ from "lodash";

function DetailCouvertures(props) {
  const [couvertures, setCouvertures] = useState([]);
  const [detailCouvertures, setDetailCouvertures] = useState([]);
  const [filteredDetailCouvertures, setFilteredDetailCouvertures] = useState(
    [],
  );
  const [selectedDetailCouverture, setSelectedDetailCouverture] =
    useState(null);
  const [selectedDetailCouvertures, setSelectedDetailCouvertures] = useState(
    [],
  );
  const [itemOffset, setItemOffset] = useState(0);

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
      const { data: couvertures } = await getCouvertures();
      setCouvertures(couvertures);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: detailCouvertures } = await getDetailCouvertures();
      setDetailCouvertures(detailCouvertures);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = detailCouvertures;
    const getData = async () => {
      if (searchQuery)
        filtered = detailCouvertures.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredDetailCouvertures(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (detailCouvertures.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    detailCouvertures,

    itemOffset,

    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalDetailCouvertures = detailCouvertures;
    setDetailCouvertures(
      detailCouvertures.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedDetailCouverture(null);
    setSelectedDetailCouvertures([]);
    try {
      items.forEach(async (item) => {
        await deleteDetailCouverture(item._id);
      });
      toast.success("detailCouverture supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("detailCouverture déja supprimé");
      setDetailCouvertures(originalDetailCouvertures);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * pageSize) % totalCount;
    setItemOffset(newOffset);
  };
  const handleSelectDetailCouverture = (detailCouverture) => {
    let newSelectedDetailCouvertures = [...selectedDetailCouvertures];

    const index = newSelectedDetailCouvertures.findIndex(
      (c) => c._id.toString() === detailCouverture._id.toString(),
    );
    if (index === -1) newSelectedDetailCouvertures.push(detailCouverture);
    else newSelectedDetailCouvertures.splice(index, 1);
    let selectedDetailCouverture = null;
    let founded = detailCouvertures.find(
      (p) => p._id.toString() === detailCouverture._id.toString(),
    );
    if (founded && newSelectedDetailCouvertures.length === 1)
      selectedDetailCouverture = founded;
    setSelectedDetailCouvertures(newSelectedDetailCouvertures);
    setSelectedDetailCouverture(
      newSelectedDetailCouvertures.length === 1
        ? selectedDetailCouverture
        : null,
    );
    setDisplayForm(false);
  };
  const handleSelectDetailCouvertures = () => {
    let newSelectedDetailCouvertures =
      selectedDetailCouvertures.length === filteredDetailCouvertures.length
        ? []
        : [...filteredDetailCouvertures];
    setSelectedDetailCouvertures(newSelectedDetailCouvertures);
    setSelectedDetailCouverture(
      newSelectedDetailCouvertures.length === 1
        ? newSelectedDetailCouvertures[0]
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
    setSelectedDetailCouverture(null);
    setSelectedDetailCouvertures([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedDetailCouverture(null);
    setSelectedDetailCouvertures([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          <BsPersonAdd className="mr-1" /> Nouveau detail couverture
        </button>
        <DetailCouvertureForm
          selectedDetailCouverture={selectedDetailCouverture}
          formToggle={toggleForm}
          updateData={updateData}
          couvertures={couvertures}
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
            Aucun detail couverture
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
        <BsPersonAdd className="mr-1" /> Nouveau detail couverture
      </button>
      <DetailCouvertureForm
        selectedDetailCouverture={selectedDetailCouverture}
        formToggle={toggleForm}
        couvertures={couvertures}
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
            label={"Objet du detailCouverture"}
          />
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des details couverture
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des detailCouvertures</button> */}
        <div className="m-2">
          <DetailCouverturesTable
            detailCouvertures={filteredDetailCouvertures}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectDetailCouverture}
            onItemsSelect={handleSelectDetailCouvertures}
            selectedItem={selectedDetailCouverture}
            selectedItems={selectedDetailCouvertures}
            onEdit={selectedDetailCouverture ? handleEdit : undefined}
            onDelete={
              selectedDetailCouverture !== null ||
              selectedDetailCouvertures.length !== 0
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

export default DetailCouvertures;
