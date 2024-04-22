import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { deleteReceptionBC } from "../../../services/pharmacie/receptionBCService";
import { getReceptionBCs } from "../../../services/pharmacie/receptionBCService";
import ReceptionBCsTable from "./receptionBCsTable";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import ClipLoader from "react-spinners/ClipLoader";
import ButtonType from "../../../assets/buttons/buttonType";
import { ReactComponent as PrecedentButton } from "../../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../../assets/icons/suivant-btn.svg";
import SearchPeriode from "../../../common/searchPeriode";
import { FaShoppingCart } from "react-icons/fa";

function ReceptionBCs() {
  const [datas, setDatas] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedReceptionBC, setSelectedReceptionBC] = useState(null);
  const [selectedReceptionBCs, setSelectedReceptionBCs] = useState([]);

  const [sortColumn, setSortColumn] = useState({
    path: "numOrdre",
    order: "desc",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDates, setSelectedDates] = useState({
    dateDebut: "",
    dateFin: "",
  });
  const [receptionBCs, setReceptionBCs] = useState([]);
  const [selectedFields, setSelectedFields] = useState([
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "numOrdre", label: "N°" },
    { order: 4, name: "date", label: "Date" },
    { order: 5, name: "societeRetenuId", label: "Société" },
    { order: 9, name: "commentaire", label: "Commentaire" },
  ]);
  const [selectedFilterItems, setSelectedFilterItems] = useState({
    statut: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const fields = [
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "numOrdre", label: "N°" },
    { order: 4, name: "date", label: "Date" },
    { order: 5, name: "societeRetenuId", label: "Société" },
    { order: 8, name: "tva", label: "TVA" },
    { order: 9, name: "commentaire", label: "Commentaire" },
  ];
  const pageSize = 10;
  const history = useHistory();

  useEffect(() => {
    const fetchReceptionBCs = async () => {
      setLoading(true);
      try {
        const {
          data: { data, totalCount },
        } = await getReceptionBCs({
          currentPage,
          pageSize,
          order: sortColumn.order,
          sortColumn: sortColumn.path,
          searchQuery,
          dateDebut: selectedDates.dateDebut,
          dateFin: selectedDates.dateFin,
          statut: selectedFilterItems.statut,
          searchQuery,
        });
        setReceptionBCs(data);
        setTotalCount(totalCount);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchReceptionBCs();
  }, [currentPage, sortColumn]);

  const handleDelete = async (items) => {
    const originalReceptionBCs = [...receptionBCs];

    try {
      await Promise.all(
        items.map(async (item) => await deleteReceptionBC(item._id)),
      );
      const updatedReceptionBCs = receptionBCs.filter(
        (item) => !items.some((selectedItem) => selectedItem._id === item._id),
      );
      setReceptionBCs(updatedReceptionBCs);
      setSelectedReceptionBC(null);
      setSelectedReceptionBCs([]);
      toast.success("Reception Bons de commande(s) supprimé(s).");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This receptionBC has already been deleted.");
      setReceptionBCs(originalReceptionBCs);
    }
  };

  const handleSelectReceptionBC = (receptionBC) => {
    let newReceptionBCs = [...selectedReceptionBCs];
    const index = newReceptionBCs.findIndex((c) => c._id === receptionBC._id);
    if (index === -1) newReceptionBCs.push(receptionBC);
    else newReceptionBCs.splice(index, 1);
    let selectedReceptionBC = null;
    let founded = receptionBCs.find((c) => c._id === receptionBC._id);
    if (founded && newReceptionBCs.length === 1) selectedReceptionBC = founded;
    setSelectedReceptionBCs(newReceptionBCs);
    setSelectedReceptionBC(
      newReceptionBCs.length === 1 ? newReceptionBCs[0] : null,
    );
  };

  const handleSelectReceptionBCs = () => {
    let newReceptionBCs =
      selectedReceptionBCs.length === receptionBCs.length
        ? []
        : [...receptionBCs];
    setSelectedReceptionBCs(newReceptionBCs);
    setSelectedReceptionBC(
      newReceptionBCs.length === 1 ? newReceptionBCs[0] : null,
    );
  };

  const handleEdit = () => {
    history.push(`/receptionbcs/${selectedReceptionBC._id}`);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };
  const handlePageClick = (event) => {
    const newCurrentPage = event.selected + 1;
    setSelectedReceptionBC(null);
    setSelectedReceptionBCs([]);
    setCurrentPage(newCurrentPage);
  };

  return (
    <div className="mt-2 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white ">
      <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste reception des bons de commandes
      </p>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/receptionbcs/new");
          }}
        >
          <FaShoppingCart className="mr-1" />
          Nouvelle reception du bon de commande
        </button>
      </div>
      {loading ? (
        <div className="m-auto my-4">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2">
          <ReceptionBCsTable
            receptionBCs={receptionBCs}
            selectedItem={selectedReceptionBC}
            selectedItems={selectedReceptionBCs}
            totalItems={receptionBCs.length}
            onSort={handleSort}
            headers={selectedFields}
            fields={fields}
            sortColumn={sortColumn}
            onItemSelect={handleSelectReceptionBC}
            onItemsSelect={handleSelectReceptionBCs}
            selectedFields={selectedFields}
            onEdit={selectedReceptionBC ? handleEdit : undefined}
            //    selectedBonCommande !== null || selectedBonCommandes.length !== 0
            onDelete={
              selectedReceptionBC !== null || selectedReceptionBCs.length !== 0
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

export default ReceptionBCs;
