import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { deleteDevi } from "../../services/deviService";
import { getMedecins } from "../../services/medecinService";
import { getDevis } from "../../services/deviPaginateService";

import DevisTable from "./devisTable";

import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import ClipLoader from "react-spinners/ClipLoader";
import ButtonType from "../../assets/buttons/buttonType";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";

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
  // const [selectedFilterItems, setSelectedFilterItems] = useState({
  //   medecinId: "",
  // });
  const [selectedDevi, setSelectedDevi] = useState(null);
  const [selectedDevis, setSelectedDevis] = useState([]);
  const [sortColumn, setSortColumn] = useState({
    path: "montant",
    order: "asc",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [devis, setDevis] = useState([]);
  const pageSize = 15;
  const history = useHistory();
  const fields = [
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "numOrdre", label: "N° ordre" },
    { order: 3, name: "patientId", label: "Patient" },
    { order: 6, name: "medecinId", label: "Medecin" },
    { order: 7, name: "montant", label: "Montant" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const { data: medecinsData } = await getMedecins();
      setDatas({
        medecins: medecinsData,
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {
          data: { data, totalCount },
        } = await getDevis({
          time: time.nom,
          date: time.value,
          pageSize,
          currentPage,
          order: sortColumn.order,
          sortColumn: sortColumn.path,
        });
        setDevis(data);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [time, currentPage, sortColumn]);

  const handleDelete = async (items) => {
    const originalDevis = devis;
    setDevis(
      devis.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedDevi(null);
    setSelectedDevis([]);
    try {
      await Promise.all(items.map(async (item) => await deleteDevi(item._id)));
      toast.success("Devi(s) supprimé(s)");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("devi déja supprimé");
      setDevis(originalDevis);
    }
  };
  const handleSelectDevi = (devi) => {
    let newSelectedDevis = [...selectedDevis];

    const index = newSelectedDevis.findIndex(
      (c) => c._id.toString() === devi._id.toString(),
    );
    if (index === -1) newSelectedDevis.push(devi);
    else newSelectedDevis.splice(index, 1);
    let selectedDevi = null;
    let founded = devis.find((p) => p._id.toString() === devi._id.toString());
    if (founded && newSelectedDevis.length === 1) selectedDevi = founded;
    setSelectedDevis(newSelectedDevis);
    setSelectedDevi(newSelectedDevis.length === 1 ? selectedDevi : null);
  };
  const handleSelectDevis = () => {
    let newSelectedDevis =
      selectedDevis.length === devis.length ? [] : [...devis];
    setSelectedDevis(newSelectedDevis);
    setSelectedDevi(newSelectedDevis.length === 1 ? newSelectedDevis[0] : null);
  };
  /*  const onFilterChange = (name, e) => {
    let newDevis = [...devis];
    let newSelectedFilterItems = { ...selectedFilterItems };
    if (name === "medecinId") {
      if (e.target.value === "") {
        newDevis = filteredDevis;
      } else {
        newDevis = filteredDevis.filter((devi) => {
          return devi.medecinId._id.toString() === e.target.value.toString();
        });
      }

      newSelectedFilterItems[name] = e.target.value;
      setFilteredDevis(newDevis);
    }
    setSelectedFilterItems(newSelectedFilterItems);
    setCurrentPage(1);
  }; */

  const handleEdit = () => {
    history.push(`/devis/${selectedDevi._id}`);
  };
  const handleAddPaiement = () => {
    history.push(`/paiements/new/${selectedDevi.patientId._id}`);
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
    setSelectedDevi(null);
    setSelectedDevis([]);
    setCurrentPage(1);
  };
  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };
  const handlePageClick = (event) => {
    const newCurrentPage = event.selected + 1; // ReactPaginate's `selected` is zero-indexed
    setCurrentPage(newCurrentPage); // This should trigger data fetching in the useEffect
  };
  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component">
      <div className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste des devis
      </div>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/devis/new");
          }}
        >
          Nouveau devi
        </button>
      </div>
      <div className="mx-2 flex h-14">
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
          <p className="rounded-sm bg-[#4F6874] p-2 text-sm font-bold text-white ">
            Total: {totalCount} devis
          </p>
        </div>
      </div>
      {/* <div className="m-2 flex w-fit flex-wrap">
        <select
          id="classification-medecins"
          onClick={handleMedecinSelect}
          name="classification"
          className=" h-9  rounded-md	border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
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
      </div> */}
      {loading ? (
        <div className="m-auto my-4">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2">
          <DevisTable
            devis={devis}
            sortColumn={sortColumn}
            onSort={handleSort}
            datas={datas}
            // selectedFilterItems={selectedFilterItems}
            // onValueChange={onFilterChange}
            headers={fields}
            totalItems={devis.length}
            onItemSelect={handleSelectDevi}
            onItemsSelect={handleSelectDevis}
            selectedItems={selectedDevis}
            selectedItem={selectedDevi}
            onAddPaiement={selectedDevi ? handleAddPaiement : undefined}
            onPrint={() => {
              console.log("print");
            }}
            onEdit={selectedDevi ? handleEdit : undefined}
            onDelete={
              selectedDevi !== null || selectedDevis.length !== 0
                ? handleDelete
                : undefined
            }
            //  selectItem, onPrint, onEdit, onDelete
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

export default Devis;
