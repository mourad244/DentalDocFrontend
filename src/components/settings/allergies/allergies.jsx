import React, { useState, useEffect } from "react";

import {
  getAllergies,
  deleteAllergie,
} from "../../../services/allergieService";

import AllergieForm from "./allergieForm";
import AllergiesTable from "./allergiesTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function Allergies(props) {
  const [allergies, setAllergies] = useState([]);
  const [filteredAllergies, setFilteredAllergies] = useState([]);
  const [selectedAllergie, setSelectedAllergie] = useState(null);
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedAllergies, setSelectedAllergies] = useState([]);

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
      const { data: allergies } = await getAllergies();
      setAllergies(allergies);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = allergies;
    const getData = async () => {
      if (searchQuery)
        filtered = allergies.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

      const endOffset = itemOffset + pageSize;
      setFilteredAllergies(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (allergies.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    allergies,
    searchQuery,
    itemOffset,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalAllergies = allergies;
    setAllergies(
      allergies.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedAllergie(null);
    setSelectedAllergies([]);
    try {
      items.forEach(async (item) => {
        await deleteAllergie(item._id);
      });
      toast.success("allergie supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("allergie déja supprimé");
      setAllergies(originalAllergies);
    }
  };
  const handleSelectAllergie = (allergie) => {
    let newSelectedAllergies = [...selectedAllergies];

    const index = newSelectedAllergies.findIndex(
      (c) => c._id.toString() === allergie._id.toString(),
    );
    if (index === -1) newSelectedAllergies.push(allergie);
    else newSelectedAllergies.splice(index, 1);
    let selectedAllergie = null;
    let founded = allergies.find(
      (p) => p._id.toString() === allergie._id.toString(),
    );
    if (founded && newSelectedAllergies.length === 1)
      selectedAllergie = founded;
    setSelectedAllergies(newSelectedAllergies);
    setSelectedAllergie(
      newSelectedAllergies.length === 1 ? selectedAllergie : null,
    );
    setDisplayForm(false);
  };
  const handleSelectAllergies = () => {
    let newSelectedAllergies =
      selectedAllergies.length === filteredAllergies.length
        ? []
        : [...filteredAllergies];
    setSelectedAllergies(newSelectedAllergies);
    setSelectedAllergie(
      newSelectedAllergies.length === 1 ? newSelectedAllergies[0] : null,
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
    setSelectedAllergie(null);
    setSelectedAllergies([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedAllergie(null);
    setSelectedAllergies([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouveau allergie
        </button>
        <AllergieForm
          selectedAllergie={selectedAllergie}
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
              label={"nom de l'allergie"}
            />
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucune allergie trouvée
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
        + Nouveau allergie
      </button>
      <AllergieForm
        selectedAllergie={selectedAllergie}
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
          Aucune allergie trouvée
        </button>
      ) : (
        <div className="w-full min-w-fit rounded-md bg-white pb-2 shadow-component">
          <button
            onClick={toggleFilter}
            className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          >
            <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15">
              <rect width="15" height="15" rx="3" fill="#ffffff" />
              <path d="M3 9V7H12.5V9H3Z" fill="#455a94" />
            </svg>
            Aucune allergie trouvée
          </button>

          <SearchBox
            value={searchQuery}
            onChange={handleSearch}
            label={"Objet du allergie"}
          />
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des allergies
        </p>
        <div className="m-2">
          <AllergiesTable
            allergies={filteredAllergies}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectAllergie}
            onItemsSelect={handleSelectAllergies}
            selectedItem={selectedAllergie}
            selectedItems={selectedAllergies}
            onEdit={selectedAllergie ? handleEdit : undefined}
            onDelete={
              selectedAllergie !== null || selectedAllergies.length !== 0
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

export default Allergies;
