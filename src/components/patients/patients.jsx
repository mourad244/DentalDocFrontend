import React, { useState, useEffect } from "react";

import { getRegions } from "../../services/regionService";
import { getProvinces } from "../../services/provinceService";
import { deletePatient } from "../../services/patientService";
import { getPatientsList } from "../../services/patientListService";

import PatientsTable from "./patientsTable";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { BsPersonAdd } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import SearchBox from "../../common/searchBox";
import ClipLoader from "react-spinners/ClipLoader";
import { getPatientsListWithPagination } from "../../services/patientListPaginateService";

function Patients() {
  const [selectedFilterItems, setSelectedFilterItems] = useState({
    isMasculin: undefined,
    provinceId: "",
    regionId: "",
  });

  const [datas, setDatas] = useState({
    regions: [],
    provinces: [],
  });
  const [sortColumn, setSortColumn] = useState({
    path: "nom",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedFields, setSelectedFields] = useState([
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "genre", label: "Genre" },
    { order: 3, name: "nom", label: "Nom" },
    { order: 4, name: "prenom", label: "Prénom" },
    { order: 5, name: "cin", label: "CIN" },
    { order: 7, name: "telephone", label: "Téléphone" },
    { order: 8, name: "provinceId", label: "Province" },
    { order: 9, name: "age", label: "Age" },
  ]);
  const fields = [
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "genre", label: "Genre" },
    { order: 3, name: "nom", label: "Nom" },
    { order: 4, name: "prenom", label: "Prénom" },
    { order: 5, name: "cin", label: "CIN" },
    { order: 6, name: "dateNaissance", label: "Date de naissance" },
    { order: 7, name: "telephone", label: "Téléphone" },
    { order: 8, name: "provinceId", label: "Province" },
    { order: 9, name: "age", label: "Age" },
  ];
  const pageSize = 6;
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: regionsData } = await getRegions();
      const { data: provincesData } = await getProvinces();
      setDatas({ regions: regionsData, provinces: provincesData });
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("currentPage", currentPage);
      try {
        const {
          data: { data, totalCount },
        } = await getPatientsListWithPagination({
          currentPage,
          pageSize,
          sortColumn: sortColumn.path,
          order: sortColumn.order,
          searchQuery,
        });
        setPatients(data); // Assuming the response structure includes { data: [...], totalCount: Number }
        setTotalCount(totalCount);
      } catch (error) {
        // Handle error
        console.error("Failed to fetch data:", error);
      }
      setLoading(false);
    };

    if (dataUpdated || currentPage) fetchData();
  }, [dataUpdated, currentPage, searchQuery, sortColumn]);

  useEffect(() => {
    // Reset itemOffset on currentPage change
    setItemOffset((currentPage - 1) * pageSize);
  }, [currentPage, pageSize]);

  const handleSelectField = (field) => {
    const selectedFieldsA = [...selectedFields];
    const index = selectedFieldsA.findIndex(
      (f) => f.name.toString() === field.name.toString(),
    );
    if (index === -1) selectedFieldsA.push(field);
    else selectedFieldsA.splice(index, 1);
    selectedFieldsA.sort((a, b) => a.order - b.order);
    setSelectedFields(selectedFieldsA);
  };

  const onFilterChange = (name, e) => {
    // e.target.value can be "masculin", "feminin", ""
    //  i want the value to be true, false, ""
    let value = "";
    switch (e.target.value) {
      case "masculin":
        value = true;
        break;
      case "feminin":
        value = false;
        break;
      default:
        break;
    }
    const newSelectedFilterItems = { ...selectedFilterItems };
    let newPatients = [...patients];
    if (name === "isMasculin") {
      if (value === "") newPatients = [...patients];
      else newPatients = patients.filter((p) => p.isMasculin === value);
    }
    newSelectedFilterItems[name] = value;
    setSelectedFilterItems(newSelectedFilterItems);
    setFilteredPatients(newPatients);
    setCurrentPage(1);
  };
  const handleSelectPatient = (patient) => {
    let newSelectedPatients = [...selectedPatients];

    const index = newSelectedPatients.findIndex(
      (c) => c._id.toString() === patient._id.toString(),
    );
    if (index === -1) newSelectedPatients.push(patient);
    else newSelectedPatients.splice(index, 1);
    let selectedPatient = null;
    let founded = patients.find(
      (p) => p._id.toString() === patient._id.toString(),
    );
    if (founded && newSelectedPatients.length === 1) selectedPatient = founded;
    setSelectedPatients(newSelectedPatients);
    setSelectedPatient(
      newSelectedPatients.length === 1 ? selectedPatient : null,
    );
  };

  const handleSelectPatients = () => {
    let newSelectedPatients =
      selectedPatients.length === filteredPatients.length
        ? []
        : [...filteredPatients];
    setSelectedPatients(newSelectedPatients);
    setSelectedPatient(
      newSelectedPatients.length === 1 ? newSelectedPatients[0] : null,
    );
  };
  // const handleViewDetails = () => {
  //   setShowDetails(true);
  // };

  // const handleCloseDetails = () => {
  //   // setShowDetails(false);
  // };
  const handleEdit = () => {
    history.push(`/patients/${selectedPatient._id}`);
  };
  const handleDelete = async (items) => {
    const originalPatients = patients;
    setPatients(
      patients.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedPatient(null);
    setSelectedPatients([]);
    try {
      items.forEach(async (item) => {
        await deletePatient(item._id);
      });
      toast.success("patients supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("patient déja supprimé");
      setPatients(originalPatients);
    }
  };

  const handlePageClick = (event) => {
    const newCurrentPage = event.selected + 1; // ReactPaginate's `selected` is zero-indexed
    setCurrentPage(newCurrentPage); // This should trigger data fetching in the useEffect
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // const updateData = () => {
  //   setDataUpdated(true);
  //   setSelectedPatient(null);
  //   setSelectedPatients([]);
  //   setFormDisplay(false);
  // };

  const handleSort = (column) => {
    setSortColumn(column);
  };

  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white ">
      <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste des patients
      </p>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/patients/new");
          }}
        >
          <BsPersonAdd className="mr-1" />
          Nouveau patient
        </button>
      </div>
      <div className="ml-2 mt-2">
        <SearchBox value={searchQuery} onChange={handleSearch}></SearchBox>
      </div>
      {loading ? (
        <div className="m-auto my-4">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2">
          <PatientsTable
            patients={patients}
            sortColumn={sortColumn}
            onSort={handleSort}
            fields={fields}
            datas={datas}
            selectedFilterItems={selectedFilterItems}
            onValueChange={onFilterChange}
            headers={selectedFields}
            onFieldSelect={handleSelectField}
            totalItems={patients.length}
            onItemSelect={handleSelectPatient}
            onItemsSelect={handleSelectPatients}
            selectedItems={selectedPatients}
            selectedItem={selectedPatient}
            onPrint={() => {
              console.log("print");
            }}
            onEdit={selectedPatient ? handleEdit : undefined}
            onDelete={
              selectedPatient !== null || selectedPatients.length !== 0
                ? handleDelete
                : undefined
            }
            // onViewDetails={selectedPatient ? handleViewDetails : undefined}
          />
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={">"}
            breakClassName={"break-me"}
            pageCount={Math.ceil(totalCount / pageSize)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            forcePage={currentPage - 1}
            onPageChange={handlePageClick}
            // className="w-max-[92%] mx-3 my-auto flex  w-fit list-none justify-evenly rounded-lg bg-[#D6E1E3] p-3 font-bold text-white"
            previousLabel={"<"}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
          />
        </div>
      )}
    </div>
  );
}

export default Patients;
