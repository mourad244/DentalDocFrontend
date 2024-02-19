import React, { useState } from "react";

import CustomeTable from "../../common/CustomeTable";

import Moment from "react-moment";
import { v4 as uuidv4 } from "uuid";
import { FaPrint } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { AiTwotoneEdit } from "react-icons/ai";
import { TbReportMoney } from "react-icons/tb";

function DevisTable({
  devis,
  datas,
  onSort,
  onEdit,
  onPrint,
  headers,
  onDelete,
  sortColumn,
  totalItems,
  onItemSelect,
  onItemsSelect,
  selectedItems,
  onValueChange,
  onAddPaiement,
  selectedFilterItems,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [selectedCollapse, setSelectedCollapse] = useState("");
  const collapseFunction = (collapse) => {
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
  };
  const tableRows = devis.map((devi) => {
    return (
      <tr
        className=" h-12  border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center"
        key={uuidv4()}
      >
        <td className=" h-12  border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center">
          <input
            type="checkbox"
            checked={selectedItems.findIndex((c) => c._id === devi._id) !== -1}
            onChange={() => onItemSelect(devi)}
          />
        </td>

        {headers.map((header, index) => {
          const key = header.name;
          switch (key) {
            case "select":
              break;
            case "patientId":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {devi.patientId.nom} {devi.patientId.prenom}
                </td>
              );

            case "date":
              if (devi.date === undefined) return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  <Moment date={devi.date} format="DD/MM/YYYY">
                    {devi.date}
                  </Moment>
                </td>
              );
            case "medecinId":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {devi.medecinId && devi.medecinId.nom}{" "}
                  {devi.medecinId && devi.medecinId.prenom}
                </td>
              );

            default:
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {devi[key]}
                </td>
              );
          }
        })}
      </tr>
    );
  });
  const filterFunctions = (
    <div className="m-1 mt-2 flex  w-full items-center gap-2 rounded-md  border-slate-300 bg-[#6d71be47] shadow-md ">
      <div className="m-2">
        <div className=" flex w-fit flex-wrap">
          <label
            className="mr-3 text-right text-xs font-bold leading-9 text-[#72757c]"
            style={{ width: 200 }}
          >
            Medecin
          </label>
          <select
            className=" w-24 rounded-md	border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
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
  );
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setSelectedCollapse(isFilterOpen ? "" : "filter");
    setIsCollapseOpen(!isCollapseOpen);
  };
  const collapseButton = (
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
  );
  const tableControlPanel = (
    <div className="mb-1 flex flex-col">
      <div className="flex flex-row">{collapseButton}</div>
      {collapseFunction(selectedCollapse)}
    </div>
  );
  const itemActions = (
    <div className=" my-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#6d71be47] shadow-md ">
      <TbReportMoney
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onAddPaiement === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={onAddPaiement}
        title="Ajouter un paiement"
      />

      <AiTwotoneEdit
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onEdit === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={onEdit}
        title="Modifier"
      />
      {/*  <GrFormView
        className="  h-6 w-7 cursor-pointer rounded-md  "
        onClick={onViewDetails}
      /> */}
      <AiFillDelete
        className={`h-6 w-7 cursor-pointer rounded-md   p-1 shadow-md  ${
          onDelete === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={() => {
          window.confirm("Confirmer la suppression") && onDelete(selectedItems);
        }}
        title="Supprimer"
      />
      <FaPrint
        className={`$ h-6 w-7 cursor-pointer rounded-md p-1 shadow-md ${
          onPrint === undefined ? "pointer-events-none opacity-50" : ""
        }`}
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
      tableControlPanel={tableControlPanel}
      selectedItems={selectedItems}
      onSort={onSort}
      onItemsSelect={onItemsSelect}
      sortColumn={sortColumn}
    />
  );
}

export default DevisTable;
