import React, { useState, useEffect } from "react";

import {
  getProvinces,
  deleteProvince,
} from "../../../services/provinceService";
import { getRegions } from "../../../services/regionService";

import ProvinceForm from "./provinceForm";
import ProvincesTable from "./provincesTable";

import SearchBox from "../../../common/searchBox";

import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { BsPersonAdd } from "react-icons/bs";

import _ from "lodash";

function Provinces(props) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);

  const [filterDisplay, setFilterDisplay] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [displayForm, setDisplayForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState({
    path: "niveau",
    order: "desc",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      const { data: regions } = await getRegions();
      setRegions(regions);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: provinces } = await getProvinces();
      setProvinces(provinces);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = provinces;
    const getData = async () => {
      if (searchQuery)
        filtered = provinces.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredProvinces(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (provinces.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    provinces,
    itemOffset,
    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalProvinces = provinces;
    setProvinces(
      provinces.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedProvince(null);
    setSelectedProvinces([]);
    try {
      items.forEach(async (item) => {
        await deleteProvince(item._id);
      });
      toast.success("province supprimée");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("province déja supprimée");
      setProvinces(originalProvinces);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * pageSize) % totalCount;
    setItemOffset(newOffset);
  };
  const handleSelectProvince = (province) => {
    let newSelectedProvinces = [...selectedProvinces];

    const index = newSelectedProvinces.findIndex(
      (c) => c._id.toString() === province._id.toString(),
    );
    if (index === -1) newSelectedProvinces.push(province);
    else newSelectedProvinces.splice(index, 1);
    let selectedProvince = null;
    let founded = provinces.find(
      (p) => p._id.toString() === province._id.toString(),
    );
    if (founded && newSelectedProvinces.length === 1)
      selectedProvince = founded;
    setSelectedProvinces(newSelectedProvinces);
    setSelectedProvince(
      newSelectedProvinces.length === 1 ? selectedProvince : null,
    );
    setDisplayForm(false);
  };
  const handleSelectProvinces = () => {
    let newSelectedProvinces =
      selectedProvinces.length === filteredProvinces.length
        ? []
        : [...filteredProvinces];
    setSelectedProvinces(newSelectedProvinces);
    setSelectedProvince(
      newSelectedProvinces.length === 1 ? newSelectedProvinces[0] : null,
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
    setSelectedProvince(null);
    setSelectedProvinces([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedProvince(null);
    setSelectedProvinces([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          <BsPersonAdd className="mr-1" /> Nouvelle province
        </button>
        <ProvinceForm
          selectedProvince={selectedProvince}
          regions={regions}
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
                label={"Nom de l'province"}
              />
            </div>
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucune province trouvée
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
        <BsPersonAdd className="mr-1" /> Nouvelle province
      </button>
      <ProvinceForm
        selectedProvince={selectedProvince}
        formToggle={toggleForm}
        regions={regions}
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
        <div className="w-full min-w-fit rounded-md bg-white pb-2 shadow-component  ">
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
              label={"Nom de l'province"}
            />
          </div>
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des provinces
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des provinces</button> */}
        <div className="m-2">
          <ProvincesTable
            provinces={filteredProvinces}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectProvince}
            onItemsSelect={handleSelectProvinces}
            selectedItem={selectedProvince}
            selectedItems={selectedProvinces}
            onEdit={selectedProvince ? handleEdit : undefined}
            onDelete={
              selectedProvince !== null || selectedProvinces.length !== 0
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

export default Provinces;
