import React, { useState, useEffect } from "react";

import { getMedecins, deleteMedecin } from "../../../services/medecinService";

import MedecinForm from "./medecinForm";
import MedecinsTable from "./medecinsTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function Medecins(props) {
  const [medecins, setMedecins] = useState([]);
  const [filteredMedecins, setFilteredMedecins] = useState([]);
  const [selectedMedecin, setSelectedMedecin] = useState(null);
  const [selectedMedecins, setSelectedMedecins] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({ path: "nom", order: "desc" });

  const [dataUpdated, setDataUpdated] = useState(true);
  const [displayForm, setDisplayForm] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState(false);

  const [itemOffset, setItemOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  useEffect(() => {
    const fetchData = async () => {
      const { data: medecins } = await getMedecins();
      setMedecins(medecins);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = medecins;
    const getData = async () => {
      if (searchQuery)
        filtered = medecins.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

      const endOffset = itemOffset + pageSize;
      setFilteredMedecins(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (medecins.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    medecins,
    searchQuery,
    itemOffset,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalMedecins = medecins;
    setMedecins(
      medecins.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedMedecin(null);
    setSelectedMedecins([]);
    try {
      items.forEach(async (item) => {
        await deleteMedecin(item._id);
      });
      toast.success("medecin supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("medecin déja supprimé");
      setMedecins(originalMedecins);
    }
  };
  const handleSelectMedecin = (medecin) => {
    let newSelectedMedecins = [...selectedMedecins];

    const index = newSelectedMedecins.findIndex(
      (c) => c._id.toString() === medecin._id.toString(),
    );
    if (index === -1) newSelectedMedecins.push(medecin);
    else newSelectedMedecins.splice(index, 1);
    let selectedMedecin = null;
    let founded = medecins.find(
      (p) => p._id.toString() === medecin._id.toString(),
    );
    if (founded && newSelectedMedecins.length === 1) selectedMedecin = founded;
    setSelectedMedecins(newSelectedMedecins);
    setSelectedMedecin(
      newSelectedMedecins.length === 1 ? selectedMedecin : null,
    );
    setDisplayForm(false);
  };
  const handleSelectMedecins = () => {
    let newSelectedMedecins =
      selectedMedecins.length === filteredMedecins.length
        ? []
        : [...filteredMedecins];
    setSelectedMedecins(newSelectedMedecins);
    setSelectedMedecin(
      newSelectedMedecins.length === 1 ? newSelectedMedecins[0] : null,
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
    setSelectedMedecin(null);
    setSelectedMedecins([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedMedecin(null);
    setSelectedMedecins([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouveau medecin
        </button>
        <MedecinForm
          selectedMedecin={selectedMedecin}
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

            <SearchBox
              value={searchQuery}
              onChange={handleSearch}
              label={"nom de l'medecin"}
            />
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucun medecin trouvé
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
        + Nouveau medecin
      </button>
      <MedecinForm
        selectedMedecin={selectedMedecin}
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
          Aucun medecin trouvé
        </button>
      ) : (
        <div className="w-full min-w-fit rounded-md bg-white pb-2 shadow-component">
          <button
            onClick={toggleFilter}
            className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          >
            <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15">
              <rect width="15" height="15" rx="3" fill="#ffffff" />
              <path d="M3 9V7H12.5V9H3Z" fill="#4F6874" />
            </svg>
            Aucun medecin trouvé
          </button>

          <SearchBox
            value={searchQuery}
            onChange={handleSearch}
            label={"Objet du medecin"}
          />
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des medecins
        </p>
        <div className="m-2">
          <MedecinsTable
            medecins={filteredMedecins}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectMedecin}
            onItemsSelect={handleSelectMedecins}
            selectedItem={selectedMedecin}
            selectedItems={selectedMedecins}
            onEdit={selectedMedecin ? handleEdit : undefined}
            onDelete={
              selectedMedecin !== null || selectedMedecins.length !== 0
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

export default Medecins;
