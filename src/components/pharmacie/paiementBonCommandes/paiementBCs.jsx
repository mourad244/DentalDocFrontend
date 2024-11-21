import React, { useState, useEffect } from "react";
import { /*  withRouter, */ useHistory } from "react-router-dom";

import { deletePaiementBC } from "../../../services/pharmacie/paiementBCBCService";
import PaiementBCsTable from "./paiementBCsTable";
import { getPaiementBCs } from ".../../../services/pharmacie/paiementBCBCService";
// import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import ClipLoader from "react-spinners/ClipLoader";
import ButtonType from "../../assets/buttons/buttonType";
import PrecedentButton from "../../assets/icons/precedent-btn.svg";
import img from "../../assets/icons/suivant-btn.svg";

function PaiementBCs() {
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

  const [selectedPaiementBC, setSelectedPaiementBC] = useState(null);
  const [selectedPaiementBCs, setSelectedPaiementBCs] = useState([]);
  const [sortColumn, setSortColumn] = useState({
    path: "date",
    order: "asc",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [paiementBCs, setPaiementBCs] = useState([]);
  const pageSize = 20;
  const history = useHistory();
  const fields = [
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "numOrdre", label: "N° ordre" },
    { order: 3, name: "bonCommandeId", label: "Bon commande" },
    { order: 4, name: "mode", label: "Mode Paiement" },
    // { order: 5, name: "date", label: "Date" },
    { order: 6, name: "montant", label: "Montant" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {
          data: { data, totalCount },
        } = await getPaiementBCs({
          time: time.nom,
          date: time.value,
          pageSize,
          currentPage,
          order: sortColumn.order,
          sortColumn: sortColumn.path,
        });
        setPaiementBCs(data);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [time, currentPage, sortColumn]);

  const handleDelete = async (items) => {
    const originalPaiemntBCs = paiementBCs;
    setPaiementBCs(
      paiementBCs.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedPaiementBC(null);
    setSelectedPaiementBCs([]);
    try {
      await Promise.all(
        items.map(async (item) => await deletePaiementBC(item._id)),
      );
      toast.success("PaiementBC(s) supprimé(s)");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("paiementBC déja supprimé");
      setPaiementBCs(originalPaiemntBCs);
    }
  };

  const handleSelectPaiementBC = (devi) => {
    let newSelectedPaiementBCs = [...selectedPaiementBCs];

    const index = newSelectedPaiementBCs.findIndex(
      (c) => c._id.toString() === devi._id.toString(),
    );
    if (index === -1) newSelectedPaiementBCs.push(devi);
    else newSelectedPaiementBCs.splice(index, 1);
    let selectedPaiementBC = null;
    let founded = paiementBCs.find(
      (p) => p._id.toString() === devi._id.toString(),
    );
    if (founded && newSelectedPaiementBCs.length === 1)
      selectedPaiementBC = founded;
    setSelectedPaiementBCs(newSelectedPaiementBCs);
    setSelectedPaiementBC(
      newSelectedPaiementBCs.length === 1 ? selectedPaiementBC : null,
    );
  };
  const handleSelectPaiementBCs = () => {
    let newSelectedPaiementBCs =
      selectedPaiementBCs.length === paiementBCs.length ? [] : [...paiementBCs];
    setSelectedPaiementBCs(newSelectedPaiementBCs);
    setSelectedPaiementBC(
      newSelectedPaiementBCs.length === 1 ? newSelectedPaiementBCs[0] : null,
    );
  };

  const handleEdit = () => {
    history.push(`/paiementBCs/${selectedPaiementBC._id}`);
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
    setSelectedPaiementBC(null);
    setSelectedPaiementBCs([]);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };
  const handlePageClick = (event) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };
  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component">
      <div className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste des paiementBCs
      </div>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/paiementBCs/new");
          }}
        >
          Nouveau paiementBC
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
          <img
            className="cursor-pointer"
            onClick={() => {
              navigateDate(time, -1);
            }}
            src={PrecedentButton}
          />
          <p className="text-md m-auto mx-3 font-bold leading-5">
            {displayDate(time.nom)}
          </p>

          <img
            className="cursor-pointer"
            onClick={() => {
              navigateDate(time, 1);
            }}
            src={img}
          />
        </div>
        <div className="mr-2  flex items-center">
          <p className="rounded-sm bg-[#4F6874] p-2 text-sm font-bold text-white ">
            Total: {totalCount} paiementBCs
          </p>
        </div>
      </div>
      {/* <div className="mx-2 flex justify-between">
        <div className="flex items-center">
          <p className=" text-xs font-bold">Imprimer les paiementBCs</p>
          <PaiementBCsList
            typeDate={time.nom}
            date={time.value}
            filteredPaiementBCs={totalFilteredPaiementBCs}
          />
        </div>
        <div className="flex items-center">
          <p className="text-xs font-bold">Imprimer les recc</p>
          <Recettes
            typeDate={time.nom}
            date={time.value}
            filteredPaiementBCs={totalFilteredPaiementBCs}
          />
        </div>
      </div> */}
      {loading ? (
        <div className="m-auto my-4">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2">
          <PaiementBCsTable
            paiementBCs={paiementBCs}
            sortColumn={sortColumn}
            onSort={handleSort}
            headers={fields}
            totaItems={paiementBCs.length}
            onItemSelect={handleSelectPaiementBC}
            onItemsSelect={handleSelectPaiementBCs}
            selectedItems={selectedPaiementBCs}
            selectedItem={selectedPaiementBC}
            onPrint={() => {
              console.log("print");
            }}
            onEdit={selectedPaiementBC ? handleEdit : undefined}
            onDelete={
              selectedPaiementBC !== null || selectedPaiementBCs.length !== 0
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

export default PaiementBCs;
