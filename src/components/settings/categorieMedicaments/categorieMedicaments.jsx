import React, { useState, useEffect } from "react";

import {
  getCategorieMedicaments,
  deleteCategorieMedicament,
} from "../../../services/categorieMedicamentService";

import CategorieMedicamentForm from "./categorieMedicamentForm";
import CategorieMedicamentsTable from "./categorieMedicamentsTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function CategorieMedicaments(props) {
  const [itemOffset, setItemOffset] = useState(0);
  const [categorieMedicaments, setCategorieMedicaments] = useState([]);
  const [filteredCategorieMedicaments, setFilteredCategorieMedicaments] =
    useState([]);
  const [selectedCategorieMedicament, setSelectedCategorieMedicament] =
    useState(null);
  const [selectedCategorieMedicaments, setSelectedCategorieMedicaments] =
    useState([]);

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
      const { data: categorieMedicaments } = await getCategorieMedicaments();
      setCategorieMedicaments(categorieMedicaments);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = categorieMedicaments;
    const getData = async () => {
      if (searchQuery)
        filtered = categorieMedicaments.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

      const endOffset = itemOffset + pageSize;
      setFilteredCategorieMedicaments(sorted.slice(itemOffset, endOffset));
    };
    if (categorieMedicaments.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    categorieMedicaments,
    searchQuery,
    itemOffset,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalCategorieMedicaments = categorieMedicaments;
    setCategorieMedicaments(
      categorieMedicaments.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedCategorieMedicament(null);
    setSelectedCategorieMedicaments([]);
    try {
      items.forEach(async (item) => {
        await deleteCategorieMedicament(item._id);
      });
      toast.success("categorieMedicament supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("categorieMedicament déja supprimé");
      setCategorieMedicaments(originalCategorieMedicaments);
    }
  };
  const handleSelectCategorieMedicament = (categorieMedicament) => {
    let newSelectedCategorieMedicaments = [...selectedCategorieMedicaments];

    const index = newSelectedCategorieMedicaments.findIndex(
      (c) => c._id.toString() === categorieMedicament._id.toString(),
    );
    if (index === -1) newSelectedCategorieMedicaments.push(categorieMedicament);
    else newSelectedCategorieMedicaments.splice(index, 1);
    let selectedCategorieMedicament = null;
    let founded = categorieMedicaments.find(
      (p) => p._id.toString() === categorieMedicament._id.toString(),
    );
    if (founded && newSelectedCategorieMedicaments.length === 1)
      selectedCategorieMedicament = founded;
    setSelectedCategorieMedicaments(newSelectedCategorieMedicaments);
    setSelectedCategorieMedicament(
      newSelectedCategorieMedicaments.length === 1
        ? selectedCategorieMedicament
        : null,
    );
    setDisplayForm(false);
  };
  const handleSelectCategorieMedicaments = () => {
    let newSelectedCategorieMedicaments =
      selectedCategorieMedicaments.length ===
      filteredCategorieMedicaments.length
        ? []
        : [...filteredCategorieMedicaments];
    setSelectedCategorieMedicaments(newSelectedCategorieMedicaments);
    setSelectedCategorieMedicament(
      newSelectedCategorieMedicaments.length === 1
        ? newSelectedCategorieMedicaments[0]
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
    setSelectedCategorieMedicament(null);
    setSelectedCategorieMedicaments([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedCategorieMedicament(null);
    setSelectedCategorieMedicaments([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouvelle categorie medicament
        </button>
        <CategorieMedicamentForm
          selectedCategorieMedicament={selectedCategorieMedicament}
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
              label={"nom du categorieMedicament"}
            />
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucune categorie medicament trouvée
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
        + Nouvelle categorie medicament
      </button>
      <CategorieMedicamentForm
        selectedCategorieMedicament={selectedCategorieMedicament}
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
            label={"Objet du categorieMedicament"}
          />
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des categories medicaments
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des categorieMedicaments</button> */}
        <div className="m-2">
          <CategorieMedicamentsTable
            categorieMedicaments={filteredCategorieMedicaments}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectCategorieMedicament}
            onItemsSelect={handleSelectCategorieMedicaments}
            selectedItem={selectedCategorieMedicament}
            selectedItems={selectedCategorieMedicaments}
            onEdit={selectedCategorieMedicament ? handleEdit : undefined}
            onDelete={
              selectedCategorieMedicament !== null ||
              selectedCategorieMedicaments.length !== 0
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
            previousLabel={"<"}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
          />
        </div>
      </div>
    </>
  );
}

export default CategorieMedicaments;
