import React, { useState, useEffect } from "react";

import {
  getMedicaments,
  deleteMedicament,
} from "../../../services/medicamentService";
import { getCategorieMedicaments } from "../../../services/categorieMedicamentService";

import MedicamentForm from "./medicamentForm";
import MedicamentsTable from "./medicamentsTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function Medicaments(props) {
  const [medicaments, setMedicaments] = useState([]);
  const [categorieMedicaments, setCategorieMedicaments] = useState([]);
  const [filteredMedicaments, setFilteredMedicaments] = useState([]);
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const [selectedMedicaments, setSelectedMedicaments] = useState([]);

  const [filterDisplay, setFilterDisplay] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [displayForm, setDisplayForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState({ path: "nom", order: "desc" });
  const [itemOffset, setItemOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      const { data: categorieMedicaments } = await getCategorieMedicaments();
      setCategorieMedicaments(categorieMedicaments);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const { data: medicaments } = await getMedicaments();
      setMedicaments(medicaments);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = medicaments;
    const getData = async () => {
      if (searchQuery)
        filtered = medicaments.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

      const endOffset = itemOffset + pageSize;
      setFilteredMedicaments(sorted.slice(itemOffset, endOffset));
    };
    if (medicaments.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    medicaments,
    searchQuery,
    itemOffset,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalMedicaments = medicaments;
    setMedicaments(
      medicaments.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedMedicament(null);
    setSelectedMedicaments([]);
    try {
      items.forEach(async (item) => {
        await deleteMedicament(item._id);
      });
      toast.success("medicament supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("medicament déja supprimé");
      setMedicaments(originalMedicaments);
    }
  };
  const handleSelectMedicament = (medicament) => {
    let newSelectedMedicaments = [...selectedMedicaments];

    const index = newSelectedMedicaments.findIndex(
      (c) => c._id.toString() === medicament._id.toString(),
    );
    if (index === -1) newSelectedMedicaments.push(medicament);
    else newSelectedMedicaments.splice(index, 1);
    let selectedMedicament = null;
    let founded = medicaments.find(
      (p) => p._id.toString() === medicament._id.toString(),
    );
    if (founded && newSelectedMedicaments.length === 1)
      selectedMedicament = founded;
    setSelectedMedicaments(newSelectedMedicaments);
    setSelectedMedicament(
      newSelectedMedicaments.length === 1 ? selectedMedicament : null,
    );
    setDisplayForm(false);
  };
  const handleSelectMedicaments = () => {
    let newSelectedMedicaments =
      selectedMedicaments.length === filteredMedicaments.length
        ? []
        : [...filteredMedicaments];
    setSelectedMedicaments(newSelectedMedicaments);
    setSelectedMedicament(
      newSelectedMedicaments.length === 1 ? newSelectedMedicaments[0] : null,
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
    setSelectedMedicament(null);
    setSelectedMedicaments([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedMedicament(null);
    setSelectedMedicaments([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouveau medicament
        </button>
        <MedicamentForm
          selectedMedicament={selectedMedicament}
          formToggle={toggleForm}
          categorieMedicaments={categorieMedicaments}
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
              label={"nom du medicament"}
            />
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucun medicament trouvé
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
        + Nouveau medicament
      </button>
      <MedicamentForm
        selectedMedicament={selectedMedicament}
        formToggle={toggleForm}
        categorieMedicaments={categorieMedicaments}
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
        <div className="w-full min-w-fit rounded-md bg-white  pb-2 shadow-component">
          <button
            onClick={toggleFilter}
            className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
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
            label={"Objet du medicament"}
          />
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des medicaments
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des medicaments</button> */}
        <div className="m-2">
          <MedicamentsTable
            medicaments={filteredMedicaments}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectMedicament}
            onItemsSelect={handleSelectMedicaments}
            selectedItem={selectedMedicament}
            selectedItems={selectedMedicaments}
            onEdit={selectedMedicament ? handleEdit : undefined}
            onDelete={
              selectedMedicament !== null || selectedMedicaments.length !== 0
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

export default Medicaments;
