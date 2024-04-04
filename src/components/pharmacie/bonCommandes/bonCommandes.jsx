import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { deleteBonCommande } from "../../../services/pharmacie/bonCommandeService";
import { getBonCommandes } from "../../../services/pharmacie/bonCommandeService";
import BonCommandesTable from "./bonCommandesTable";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import ClipLoader from "react-spinners/ClipLoader";
import ButtonType from "../../../assets/buttons/buttonType";
import { ReactComponent as PrecedentButton } from "../../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../../assets/icons/suivant-btn.svg";
import SearchPeriode from "../../../common/searchPeriode";
import { FaShoppingCart } from "react-icons/fa";
import { getBonCommandesListWithPagination } from "../../../services/pharmacie/bonCommandeListPaginateService";

function BonCommandes() {
  const [datas, setDatas] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedBonCommande, setSelectedBonCommande] = useState(null);
  const [selectedBonCommandes, setSelectedBonCommandes] = useState([]);

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
  const [bonCommandes, setBonCommandes] = useState([]);
  const [selectedFields, setSelectedFields] = useState([
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "numOrdre", label: "N°" },
    { order: 3, name: "objet", label: "Objet" },
    { order: 4, name: "date", label: "Date" },
    { order: 5, name: "societeRetenuId", label: "Société retenue" },
    { order: 7, name: "montantTTC", label: "Montant TTC" },
    { order: 9, name: "commentaire", label: "Commentaire" },
  ]);
  const [selectedFilterItems, setSelectedFilterItems] = useState({
    statut: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const fields = [
    { order: 1, name: "select", label: "Select" },
    { order: 2, name: "numOrdre", label: "N°" },
    { order: 3, name: "objet", label: "Objet" },
    { order: 4, name: "date", label: "Date" },
    { order: 5, name: "societeRetenuId", label: "Société retenue" },
    { order: 6, name: "montantHT", label: "Montant HT" },
    { order: 7, name: "montantTTC", label: "Montant TTC" },
    { order: 8, name: "tva", label: "TVA" },
    { order: 9, name: "commentaire", label: "Commentaire" },
  ];
  const pageSize = 10;
  const history = useHistory();

  useEffect(() => {
    const fetchBonCommandes = async () => {
      setLoading(true);
      try {
        const {
          data: { data, totalCount },
        } = await getBonCommandesListWithPagination({
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
        setBonCommandes(data);
        setTotalCount(totalCount);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchBonCommandes();
  }, [currentPage, sortColumn]);

  const handleDelete = async (bonCommandes) => {
    const originalBonCommandes = bonCommandes;
    setBonCommandes(bonCommandes.filter((c) => c._id !== bonCommandes._id));
    setSelectedBonCommande(null);
    setSelectedBonCommandes([]);
    try {
      await Promise.all(
        bonCommandes.map(
          async (bonCommande) => await deleteBonCommande(bonCommande._id),
        ),
      );
      toast.success("Bons de commande(s) supprimé(s).");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This bonCommande has already been deleted.");
      setBonCommandes(originalBonCommandes);
    }
  };

  const handleSelectBonCommande = (bonCommande) => {
    console.log("bonCommande", bonCommande);
    let bonCommandes = [...selectedBonCommandes];
    const index = bonCommandes.findIndex((c) => c._id === bonCommande._id);
    if (index === -1) bonCommandes.push(bonCommande);
    else bonCommandes.splice(index, 1);
    let selectedBonCommande = null;
    let founded = bonCommandes.find((c) => c._id === bonCommande._id);
    if (founded && selectedBonCommandes.length === 1)
      selectedBonCommande = founded;
    setSelectedBonCommandes(bonCommandes);
    setSelectedBonCommande(bonCommandes.length === 1 ? bonCommandes[0] : null);
  };

  const handleSelectBonCommandes = () => {
    let bonCommandes =
      selectedBonCommandes.length === bonCommandes.length
        ? []
        : [...bonCommandes];
    setSelectedBonCommandes(bonCommandes);
    setSelectedBonCommande(bonCommandes.length === 1 ? bonCommandes[0] : null);
  };

  const handleEdit = () => {
    console.log("selctedBonCommande", selectedBonCommande);
    history.push(`/boncommandes/${selectedBonCommande._id}`);
  };
  const handleAddPaiement = () => {
    history.push(`/boncommande/paiement/${selectedBonCommande._id}`);
  };
  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };
  const handlePageClick = (event) => {
    const newCurrentPage = event.selected + 1;
    setSelectedBonCommande(null);
    setSelectedBonCommandes([]);
    setCurrentPage(newCurrentPage);
  };
  const handleSelectedDates = (dates) => {
    setSelectedDates(dates);
  };
  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white ">
      <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste des bons de commandes
      </p>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/boncommandes/new");
          }}
        >
          <FaShoppingCart className="mr-1" />
          Nouveau bon de commande
        </button>
      </div>
      {loading ? (
        <div className="m-auto my-4">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2">
          <BonCommandesTable
            bonCommandes={bonCommandes}
            selectedItem={selectedBonCommande}
            selectedItems={selectedBonCommandes}
            onSort={handleSort}
            headers={selectedFields}
            fields={fields}
            sortColumn={sortColumn}
            onItemSelect={handleSelectBonCommande}
            onItemsSelect={handleSelectBonCommandes}
            selectedFields={selectedFields}
            onEdit={handleEdit}
            onAddPaiement={handleAddPaiement}
            onDelete={handleDelete}
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

export default BonCommandes;
