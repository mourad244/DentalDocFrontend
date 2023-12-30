import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";

import { getDevis } from "../../services/deviService";
import { getMedecins } from "../../services/medecinService";
import { getCabinets } from "../../services/cabinetService";

import DevisTable from "./devisTable";

import _ from "lodash";
import ReactPaginate from "react-paginate";
import ButtonType from "../../assets/buttons/buttonType";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";
import ClipLoader from "react-spinners/ClipLoader";

import "./devis.css";

function Devis() {
  const date = new Date();
  const [times, setTimes] = useState([
    { nom: "journee", active: true },
    // { nom: "semaine", active: false },
    { nom: "mois", active: false },
    // { nom: "trimestre", active: false },
    // { nom: "semestre", active: false },
    { nom: "annee", active: false },
  ]);
  const [time, setTime] = useState({
    nom: "journee",
    value: date,
    active: true,
  });
  const [datas, setDatas] = useState({
    medecins: [],
  });
  const [loading, setLoading] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [selectedFilterItems, setSelectedFilterItems] = useState({
    medecinId: "",
  });
  const [selectedMedecin, setSelectedMedecin] = useState();
  const [itemOffset, setItemOffset] = useState(0);
  const [sortColumn, setSortColumn] = useState({ path: "prix", order: "asc" });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();

  const [devis, setDevis] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const pageSize = 15;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getMedecins();
      const medecins = [{ _id: "", nom: "Tous" }, ...data];
      setDatas({
        medecins,
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: devis } = await getDevis();
      setDevis(devis);
      setLoading(false);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = devis;
    const getData = async () => {
      switch (time.nom) {
        case "journee":
          filtered = filtered.filter(
            (m) =>
              new Date(m.dateDevi).getFullYear() === time.value.getFullYear() &&
              new Date(m.dateDevi).getMonth() === time.value.getMonth() &&
              new Date(m.dateDevi).getDate() === time.value.getDate(),
          );
          break;
        case "semaine":
          break;
        case "mois":
          filtered = filtered.filter(
            (m) =>
              new Date(m.dateDevi).getFullYear() === time.value.getFullYear() &&
              new Date(m.dateDevi).getMonth() === time.value.getMonth(),
          );
          break;
        case "trimestre":
          break;
        case "semestre":
          break;
        case "annee":
          filtered = filtered.filter(
            (m) =>
              new Date(m.dateDevi).getFullYear() === time.value.getFullYear(),
          );
          break;

        default:
          break;
      }
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

      const endOffset = itemOffset + pageSize;
      setFilteredDevis(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    getData();
    setTotalCount(filtered.length);
  }, [currentPage, itemOffset, devis, sortColumn.order, sortColumn.path, time]);

  const onFilterChange = (name, e) => {
    let newDevis = [...devis];
    let newSelectedFilterItems = { ...selectedFilterItems };
    if (name === "medecinId") {
      if (e.target.value === "") {
        newSelectedFilterItems[name] = [...devis];
      } else {
        newDevis = devis.filter((devi) => {
          return devi.medecinId === e.target.value;
        });
      }
    }
  };

  const updateTimeChanged = (index) => (e) => {
    let newArray = [...times];
    newArray.map((data) => (data.active = false));
    newArray[index].active = true;
    setTimes(newArray);
    setTime({
      nom: newArray[index].nom,
      value: date,
      active: true,
    });
    setCurrentPage(1);
  };

  const displayDate = (periode) => {
    switch (periode) {
      case "journee":
        return (
          time.value.getDate() +
          " - " +
          (time.value.getMonth() + 1) +
          " - " +
          date.getFullYear()
        );
      case "semaine":
        return;
      case "mois":
        return time.value.getMonth() + 1 + " - " + time.value.getFullYear();
      case "trimestre":
        break;
      case "semestre":
        break;
      case "annee":
        return time.value.getFullYear();
      default:
        break;
    }
  };
  const navigateDate = (time, operation) => {
    let periode;
    switch (time.nom) {
      case "journee":
        periode = { ...time };
        periode.value = new Date(
          periode.value.setDate(periode.value.getDate() + operation),
        );
        setTime(periode);
        break;
      case "semaine":
        break;
      case "mois":
        periode = { ...time };
        periode.value = new Date(
          periode.value.setMonth(periode.value.getMonth() + operation),
        );
        setTime(periode);
        break;
      case "trimestre":
        break;
      case "semestre":
        break;
      case "annee":
        periode = { ...time };
        periode.value = new Date(
          periode.value.setFullYear(periode.value.getFullYear() + operation),
        );
        setTime(periode);
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };
  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };
  const handlePageClick = (event) => {
    const newOffset = (event.selected * pageSize) % totalCount;
    setItemOffset(newOffset);
  };

  const handleMedecinSelect = (e) => {
    setSelectedMedecin(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component">
      {/* <MenuDevi /> */}
      <div className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste des devis
      </div>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/devis/new");
          }}
        >
          Nouveau devis
        </button>
      </div>
      <div className="flex h-14">
        <ul className="m-auto flex list-none rounded-md bg-[#f5f5f5] p-2 shadow-custom">
          {times.map((data, index) => (
            <li key={data.nom + index} onClick={updateTimeChanged(index)}>
              {ButtonType(data.nom, data.active)}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex">
        <div className=" m-auto my-2 flex items-center rounded-md bg-[#f5f5f5] p-2 shadow-md">
          <PrecedentButton
            className="cursor-pointer"
            onClick={() => {
              navigateDate(time, -1);
            }}
          />
          <p className="text-md m-auto mx-3 font-bold leading-5">
            {displayDate(time.nom)}
          </p>

          <SuivantButton
            className="cursor-pointer"
            onClick={() => {
              navigateDate(time, 1);
            }}
          />
        </div>
        {/* <svg width="225" height="45" viewBox="0 0 225 45">
            <path
              d="M0 10C0 4.47715 4.47715 0 10 0H214.5C220.023 0 224.5 4.47715 224.5 10V35C224.5 40.5228 220.023 45 214.5 45H10C4.47716 45 0 40.5228 0 35V10Z"
              fill="#455a94"
            />
            <text fill="white" fontSize="28" fontWeight="900">
              <tspan x="13" y="32.0703">
                Total: {totalCount} devis
              </tspan>
            </text>
          </svg> */}
      </div>
      <div className="m-2 flex w-fit flex-wrap">
        <select
          id="classification-medecins"
          onClick={handleMedecinSelect}
          name="classification"
          className=" h-9  rounded-md	border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
        >
          {datas.medecins.map((option) => {
            return (
              <option key={option._id || option.nom} value={option._id}>
                {` ${option.nom ? option.nom : ""} ${
                  option.prenom ? option.prenom : ""
                }`}
              </option>
            );
          })}
        </select>
      </div>
      {loading ? (
        <div className="spinner">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <DevisTable
          devis={filteredDevis}
          sortColumn={sortColumn}
          onSort={handleSort}
          // datas, selectedFilterItems, onFilterChange,
          datas={datas}

          //  totalItems, onItemSelect, onItemsSelect, selectedItems,
          //  selectItem, onPrint, onEdit, onDelete
        />
      )}
      <ReactPaginate
        breakLabel={"..."}
        nextLabel={"Suivant"}
        breakClassName={"break-me"}
        pageCount={Math.ceil(totalCount / pageSize)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        previousLabel={"Précédent"}
        renderOnZeroPageCount={null}
        containerClassName={"pagination"}
      />
    </div>
  );
}

export default Devis;
