import React, { useState, useEffect } from "react";
import { getPaiements } from "../../services/paiementService";

import PaiementsTable from "./paiementsTable";
import MenuPaiement from "./menuPaiement";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";
import ClipLoader from "react-spinners/ClipLoader";

import _ from "lodash";

import ButtonType from "../../assets/buttons/buttonType";

import "./paiements.css";
import ReactPaginate from "react-paginate";
import PaiementsList from "../../documents/paiementsList";
import Recettes from "../../documents/recettes";

function Paiements() {
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
  const [sortColumn, setSortColumn] = useState({
    path: "datePaiement",
    order: "asc",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allFilteredPaiements, setAllFilteredPaiements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paiements, setPaiements] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [filteredPaiements, setFilteredPaiements] = useState([]);
  const pageSize = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: paiements } = await getPaiements();
      setPaiements(paiements);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = paiements;
    const getData = async () => {
      switch (time.nom) {
        case "journee":
          filtered = filtered.filter(
            (m) =>
              new Date(m.datePaiement).getFullYear() ===
                time.value.getFullYear() &&
              new Date(m.datePaiement).getMonth() === time.value.getMonth() &&
              new Date(m.datePaiement).getDate() === time.value.getDate()
          );
          break;
        case "semaine":
          break;
        case "mois":
          filtered = filtered.filter(
            (m) =>
              new Date(m.datePaiement).getFullYear() ===
                time.value.getFullYear() &&
              new Date(m.datePaiement).getMonth() === time.value.getMonth()
          );
          break;
        case "trimestre":
          break;
        case "semestre":
          break;
        case "annee":
          filtered = filtered.filter(
            (m) =>
              new Date(m.datePaiement).getFullYear() ===
              time.value.getFullYear()
          );
          break;
        default:
          break;
      }
      const allFilteredPaiements = filtered;
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

      const endOffset = itemOffset + pageSize;

      setAllFilteredPaiements(allFilteredPaiements);
      setFilteredPaiements(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    getData();
    setTotalCount(filtered.length);
  }, [
    paiements,
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

  return (
    <>
      <MenuPaiement />
      <div className="component devis-component paiements-component">
        <div className="component-title">
          <h1>Liste des paiements </h1>
          <h1 className="paiement-total total-table">
            Total: {totalCount} paiements
          </h1>
        </div>

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
          </div>
          <div className="impression">
            <div className="impression-paiements">
              <p>Imprimer la liste des paiements</p>
              <PaiementsList
                typeDate={time.nom}
                date={time.value}
                filteredPaiements={allFilteredPaiements}
              />
            </div>
            <div className="impression-recette">
              <p>Imprimer recette de la caisse</p>
              <Recettes
                typeDate={time.nom}
                date={time.value}
                filteredPaiements={allFilteredPaiements}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="spinner">
            <ClipLoader loading={loading} size={70} />
          </div>
        ) : (
          <div>
            <PaiementsTable
              paiements={filteredPaiements}
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
        )}
      </div>
    </>
  );
}

export default Paiements;
