import React, { useState, useEffect } from "react";
import { getMedecins } from "../../services/medecinService";
import { getCabinets } from "../../services/cabinetService";
import { getDevis } from "../../services/deviService";

import DevisTable from "./devisTable";
import MenuDevi from "./menuDevi";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";
import _ from "lodash";

import ButtonType from "../../assets/buttons/buttonType";
import ReactPaginate from "react-paginate";

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
  const [classifications, setClassifications] = useState([
    { nom: "medecin", active: true },
    { nom: "cabinet", active: false },
  ]);
  const [medecins, setMedecins] = useState([]);
  const [cabinets, setCabinets] = useState([]);
  const [selectedMedecin, setSelectedMedecin] = useState();
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedCabinet, setSelectedCabinet] = useState();
  const [sortColumn, setSortColumn] = useState({ path: "prix", order: "asc" });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [devis, setDevis] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const pageSize = 15;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getMedecins();
      const medecins = [{ _id: "", nom: "Tous" }, ...data];
      const { data: oldCabinets } = await getCabinets();
      const cabinets = [{ _id: "", nom: "Tous" }, ...oldCabinets];
      const { data: devis } = await getDevis();
      setMedecins(medecins);
      setCabinets(cabinets);
      setDevis(devis);
    };
    fetchData();
  }, [setCabinets, setMedecins]);

  useEffect(() => {
    let filtered = devis;
    const getData = async () => {
      if (selectedCabinet) {
        filtered = devis.filter((m) =>
          m.cabinetId ? m.cabinetId._id === selectedCabinet : ""
        );
      } else if (selectedMedecin) {
        filtered = devis.filter((m) => m.medecinId._id === selectedMedecin);
      }
      switch (time.nom) {
        case "journee":
          filtered = filtered.filter(
            (m) =>
              new Date(m.dateDevi).getFullYear() === time.value.getFullYear() &&
              new Date(m.dateDevi).getMonth() === time.value.getMonth() &&
              new Date(m.dateDevi).getDate() === time.value.getDate()
          );
          break;
        case "semaine":
          break;
        case "mois":
          filtered = filtered.filter(
            (m) =>
              new Date(m.dateDevi).getFullYear() === time.value.getFullYear() &&
              new Date(m.dateDevi).getMonth() === time.value.getMonth()
          );
          break;
        case "trimestre":
          break;
        case "semestre":
          break;
        case "annee":
          filtered = filtered.filter(
            (m) =>
              new Date(m.dateDevi).getFullYear() === time.value.getFullYear()
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
  }, [
    selectedCabinet,
    selectedMedecin,
    classifications,
    devis,
    time,
    currentPage,
    sortColumn.path,
    sortColumn.order,
    itemOffset,
  ]);

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
  const updateClassificationChanged = (index) => {
    let newArray = [...classifications];
    newArray.map((data) => (data.active = false));
    newArray[index].active = true;
    setSelectedCabinet("");
    setSelectedMedecin("");
    setClassifications(newArray);
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
          periode.value.setDate(periode.value.getDate() + operation)
        );
        setTime(periode);
        break;
      case "semaine":
        break;
      case "mois":
        periode = { ...time };
        periode.value = new Date(
          periode.value.setMonth(periode.value.getMonth() + operation)
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
          periode.value.setFullYear(periode.value.getFullYear() + operation)
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
  const handleCabinetSelect = (e) => {
    setSelectedCabinet(e.target.value);
    setCurrentPage(1);
  };

  const handleMedecinSelect = (e) => {
    setSelectedMedecin(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <MenuDevi />

      <div className="component devis-component">
        <h1 className="component-title">Liste des devis </h1>
        <div className="content">
          <div className="time">
            <ul>
              {times.map((data, index) => (
                <li key={data.nom + index} onClick={updateTimeChanged(index)}>
                  {ButtonType(data.nom, data.active)}
                </li>
              ))}
            </ul>
          </div>
          <div className="classification-time">
            <div className="classification">
              <ul>
                {classifications.map((data, index) => {
                  return (
                    <li
                      key={data.nom + index}
                      onClick={() => updateClassificationChanged(index)}
                    >
                      {ButtonType(data.nom, data.active)}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="selected-time">
              <PrecedentButton
                onClick={() => {
                  navigateDate(time, -1);
                }}
              />
              <p>{displayDate(time.nom)}</p>

              <SuivantButton
                onClick={() => {
                  navigateDate(time, 1);
                }}
              />
            </div>
            <svg width="225" height="45" viewBox="0 0 225 45">
              <path
                d="M0 10C0 4.47715 4.47715 0 10 0H214.5C220.023 0 224.5 4.47715 224.5 10V35C224.5 40.5228 220.023 45 214.5 45H10C4.47716 45 0 40.5228 0 35V10Z"
                fill="#455a94"
              />
              <text fill="white" fontSize="28" fontWeight="900">
                <tspan x="13" y="32.0703">
                  Total: {totalCount} devis
                </tspan>
              </text>
            </svg>
          </div>
          {classifications.find((e) => e.active === true).nom === "medecin" ? (
            <div className="select-component">
              <select
                id="classification-medecins"
                onClick={handleMedecinSelect}
                name="classification"
              >
                {medecins.map((option) => {
                  return (
                    <option key={option._id || option.nom} value={option._id}>
                      {`${option.gradeId ? option.gradeId.nom : ""} ${
                        option.nom ? option.nom : ""
                      } ${option.prenom ? option.prenom : ""}`}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <div className="select-component">
              <select
                id="classification-cabinets"
                onClick={handleCabinetSelect}
                name="classification"
              >
                {cabinets.map((option) => {
                  return (
                    <option key={option._id || option.nom} value={option._id}>
                      {option.nom}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
        <DevisTable
          devis={filteredDevis}
          sortColumn={sortColumn}
          onSort={handleSort}
        />
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
    </>
  );
}

export default Devis;
