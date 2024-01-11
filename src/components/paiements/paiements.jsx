import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";

import { getPaiements, deletePaiement } from "../../services/paiementService";

import PaiementsTable from "./paiementsTable";
import Recettes from "../../documents/recettes";
import PaiementsList from "../../documents/paiementsList";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import ClipLoader from "react-spinners/ClipLoader";
import ButtonType from "../../assets/buttons/buttonType";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";

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
  const [loading, setLoading] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);

  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [selectedPaiements, setSelectedPaiements] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [sortColumn, setSortColumn] = useState({
    path: "date",
    order: "asc",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [paiements, setPaiements] = useState([]);
  const [filteredPaiements, setFilteredPaiements] = useState([]);
  const [totalFilteredPaiements, setTotalFilteredPaiements] = useState([]);
  const pageSize = 20;
  const history = useHistory();
  const fields = [
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "patientId", label: "Patient" },
    { order: 3, name: "mode", label: "Mode Paiement" },
    { order: 4, name: "date", label: "Date" },
    { order: 5, name: "montant", label: "Montant" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: paiementsData } = await getPaiements();
      setPaiements(paiementsData);
      setLoading(false);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = paiements;
    const getData = async () => {
      switch (time.nom) {
        case "journee":
          filtered = filtered.filter(
            (m) =>
              new Date(m.date).getFullYear() === time.value.getFullYear() &&
              new Date(m.date).getMonth() === time.value.getMonth() &&
              new Date(m.date).getDate() === time.value.getDate(),
          );
          break;
        case "semaine":
          break;
        case "mois":
          filtered = filtered.filter(
            (m) =>
              new Date(m.date).getFullYear() === time.value.getFullYear() &&
              new Date(m.date).getMonth() === time.value.getMonth(),
          );
          break;
        case "trimestre":
          break;
        case "semestre":
          break;
        case "annee":
          filtered = filtered.filter(
            (m) => new Date(m.date).getFullYear() === time.value.getFullYear(),
          );
          break;
        default:
          break;
      }
      const totalFilteredPaiements = filtered;
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;
      setTotalFilteredPaiements(totalFilteredPaiements);
      setFilteredPaiements(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    itemOffset,
    paiements,
    sortColumn.order,
    sortColumn.path,
    time,
  ]);

  const handleDelete = async (items) => {
    const originalPaiemnts = paiements;
    setPaiements(
      paiements.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedPaiement(null);
    setSelectedPaiements([]);
    try {
      await Promise.all(items.map((item) => deletePaiement(item._id)));
      toast.success("Paiement(s) supprimé(s)");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("paiement déja supprimé");
      setPaiements(originalPaiemnts);
    }
  };

  const handleSelectPaiement = (devi) => {
    let newSelectedPaiements = [...selectedPaiements];

    const index = newSelectedPaiements.findIndex(
      (c) => c._id.toString() === devi._id.toString(),
    );
    if (index === -1) newSelectedPaiements.push(devi);
    else newSelectedPaiements.splice(index, 1);
    let selectedPaiement = null;
    let founded = paiements.find(
      (p) => p._id.toString() === devi._id.toString(),
    );
    if (founded && newSelectedPaiements.length === 1)
      selectedPaiement = founded;
    setSelectedPaiements(newSelectedPaiements);
    setSelectedPaiement(
      newSelectedPaiements.length === 1 ? selectedPaiement : null,
    );
  };
  const handleSelectPaiements = () => {
    let newSelectedPaiements =
      selectedPaiements.length === filteredPaiements.length
        ? []
        : [...filteredPaiements];
    setSelectedPaiements(newSelectedPaiements);
    setSelectedPaiement(
      newSelectedPaiements.length === 1 ? newSelectedPaiements[0] : null,
    );
  };

  const handleEdit = () => {
    history.push(`/paiements/${selectedPaiement._id}`);
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

  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component">
      <div className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste des paiements
      </div>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/paiements/new");
          }}
        >
          Nouveau paiement
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
        <div className="mr-2  flex items-center">
          <p className="rounded-sm bg-[#495984] p-2 text-sm font-bold text-white ">
            Total: {totalCount} paiements
          </p>
        </div>
      </div>
      {/* <div className="mx-2 flex justify-between">
        <div className="flex items-center">
          <p className=" text-xs font-bold">Imprimer les paiements</p>
          <PaiementsList
            typeDate={time.nom}
            date={time.value}
            filteredPaiements={totalFilteredPaiements}
          />
        </div>
        <div className="flex items-center">
          <p className="text-xs font-bold">Imprimer les recc</p>
          <Recettes
            typeDate={time.nom}
            date={time.value}
            filteredPaiements={totalFilteredPaiements}
          />
        </div>
      </div> */}
      {console.log("filteredPaiements", filteredPaiements)}
      {loading ? (
        <div className="spinner">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2">
          <PaiementsTable
            paiements={filteredPaiements}
            sortColumn={sortColumn}
            onSort={handleSort}
            headers={fields}
            totaItems={filteredPaiements.length}
            onItemSelect={handleSelectPaiement}
            onItemsSelect={handleSelectPaiements}
            selectedItems={selectedPaiements}
            selectedItem={selectedPaiement}
            onPrint={() => {
              console.log("print");
            }}
            onEdit={selectedPaiement ? handleEdit : undefined}
            onDelete={
              selectedPaiement !== null || selectedPaiements.length !== 0
                ? handleDelete
                : undefined
            }
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
  );
}

export default Paiements;
