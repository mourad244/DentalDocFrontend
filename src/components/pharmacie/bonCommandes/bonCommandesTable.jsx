import React /* , { useState } */ from "react";

import CustomeTable from "../../../common/CustomeTable";

import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { FaPrint } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { AiTwotoneEdit } from "react-icons/ai";
import { TbReportMoney } from "react-icons/tb";
import { MdLocalGroceryStore } from "react-icons/md";

function BonCommandesTable({
  bonCommandes,
  datas,
  onSort,
  onEdit,
  onAddReceptionBC,
  onPrint,
  headers,
  onDelete,
  fields,
  sortColumn,
  totalItems,
  onItemSelect,
  onItemsSelect,
  selectedItems,
  // onValueChange,
  onAddPaiement,
  // selectedFilterItems,
}) {
  /*   const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [selectedCollapse, setSelectedCollapse] = useState(""); */
  /* const collapseFunction = (collapse) => {
    let children = <></>;
    switch (collapse) {
      case "filter":
        children = filterFunctions;
        break;
      default:
        break;
    }
    let isOpen = false;
    if (selectedCollapse === "filter" && isFilterOpen) isOpen = true;

    return (
      <div
        className={`flex flex-col gap-2 ${
          isOpen ? "h-auto" : "h-0"
        } overflow-hidden transition-all duration-500 ease-in-out`}
      >
        {children}
      </div>
    );
  }; */
  const tableRows = bonCommandes.map((bonCommande) => {
    return (
      <tr
        className=" h-12  border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center"
        key={uuidv4()}
      >
        <td className=" h-12  border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center">
          <input
            type="checkbox"
            checked={
              selectedItems.findIndex((c) => c._id === bonCommande._id) !== -1
            }
            onChange={() => onItemSelect(bonCommande)}
          />
        </td>

        {headers.map((header, index) => {
          const key = header.name;
          switch (key) {
            case "montantTTC":
              let montant = 0;
              bonCommande.articles.forEach((article) => {
                montant += article.prixTTC * article.quantiteTotal;
              });
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {montant ? `${montant} Dh` : `Non défini`}
                </td>
              );
            case "select":
              return null;
            case "statut":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {bonCommande.statut}
                </td>
              );
            case "societeRetenuId":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {bonCommande.societeRetenuId.nom}
                </td>
              );

            case "date":
              if (bonCommande.date === undefined) return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {moment(new Date(bonCommande.date).format("YYYY-MM-DD"))}
                </td>
              );

            default:
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {bonCommande[key]}
                </td>
              );
          }
        })}
      </tr>
    );
  });
  /*  const filterFunctions = (
    <div className="m-1 mt-2 flex  w-full items-center gap-2 rounded-md  border-slate-300 bg-[#D6E1E3] shadow-md ">
      <div className="m-2">
        <div className=" flex w-fit flex-wrap">
          <label
            className="mr-3 text-right text-xs font-bold leading-9 text-[#72757c]"
            style={{ width: 200 }}
          >
            Medecin
          </label>
          <select
            className=" w-24 rounded-md	border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
            id="medecinId"
            name="medecinId"
            style={{ width: 200, height: 40 }}
            onChange={(e) => {
              onValueChange("medecinId", e);
            }}
            value={selectedFilterItems.medecinId}
            // if value is object then select ._id if value is string then select value
          >
            <option value="" />
            {datas.medecins.map((option) => {
              return (
                <option key={option._id} value={option._id}>
                  {option.nom + " " + option.prenom}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  ); */
  /*  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setSelectedCollapse(isFilterOpen ? "" : "filter");
    setIsCollapseOpen(!isCollapseOpen);
  }; */
  /* const collapseButton = (
    <div className="flex flex-col gap-2 ">
      <div className="flex w-fit flex-row items-center gap-2">
        <button
          onClick={toggleFilter}
          className="rounded-sm bg-slate-300 p-1 shadow-md"
        >
          <span className="text-xs font-medium md:block">Filter</span>
        </button>
      </div>
    </div>
  ); */
  /*  const tableControlPanel = (
    <div className="mb-1 flex flex-col">
      <div className="flex flex-row">{collapseButton}</div>
      {collapseFunction(selectedCollapse)}
    </div>
  ); */
  const itemActions = (
    <div className=" my-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#D6E1E3] shadow-md ">
      <AiTwotoneEdit
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onEdit === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        color="#474a52"
        onClick={onEdit}
        title="Modifier"
      />
      <MdLocalGroceryStore
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onAddReceptionBC === undefined
            ? "pointer-events-none opacity-50 "
            : ""
        }`}
        color="#474a52"
        title="Ajouter des articles"
        onClick={onAddReceptionBC}
      />

      <TbReportMoney
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onAddPaiement === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        color="#474a52"
        onClick={onAddPaiement}
        title="Ajouter un paiement"
      />
      {/*  <GrFormView
        className="  h-6 w-7 cursor-pointer rounded-md  "
        onClick={onViewDetails}
      /> */}
      <AiFillDelete
        className={`h-6 w-7 cursor-pointer rounded-md   p-1 shadow-md  ${
          onDelete === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        color="#FF4D4D"
        onClick={() => {
          window.confirm("Confirmer la suppression") && onDelete(selectedItems);
        }}
        title="Supprimer"
      />
      <FaPrint
        className={`$ h-6 w-7 cursor-pointer rounded-md p-1 shadow-md ${
          onPrint === undefined ? "pointer-events-none opacity-50" : ""
        }`}
        color="#474a52"
        title="Imprimer"
        onClick={onPrint}
      />
    </div>
  );
  return (
    <CustomeTable
      headers={headers}
      tableRows={tableRows}
      itemActions={itemActions}
      totalItems={totalItems}
      selectedItems={selectedItems}
      // tableControlPanel={tableControlPanel}
      onSort={onSort}
      onItemsSelect={onItemsSelect}
      sortColumn={sortColumn}
    />
  );
}

export default BonCommandesTable;
