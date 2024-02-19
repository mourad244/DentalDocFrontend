import React from "react";

import CustomeTable from "../../common/CustomeTable";

import Moment from "react-moment";
import { v4 as uuidv4 } from "uuid";
import { FaPrint } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { AiTwotoneEdit } from "react-icons/ai";

function PaiementsTable({
  paiements,
  onSort,
  sortColumn,
  onEdit,
  onItemSelect,
  onItemsSelect,
  selectedItems,
  totalItems,
  onDelete,
  onPrint,
  headers,
}) {
  const tableRows = paiements.map((paiement) => {
    return (
      <tr
        className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center"
        key={uuidv4()}
      >
        <td className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center">
          <input
            type="checkbox"
            checked={
              selectedItems.findIndex((c) => c._id === paiement._id) !== -1
            }
            onChange={() => onItemSelect(paiement)}
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
                  {paiement.patientId.nom} {paiement.patientId.prenom}
                </td>
              );

            case "date":
              if (paiement.date === undefined) return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  <Moment date={paiement.date} format="DD/MM/YYYY">
                    {paiement.date}
                  </Moment>
                </td>
              );
            default:
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {paiement[key]}
                </td>
              );
          }
        })}
      </tr>
    );
  });
  const columns = [
    {
      path: "patientId.adherenceId.nom",
      label: "Adherence",
    },
    {
      path: "patientId.nom",
      label: "Nom",
    },
    {
      path: "patientId.prenom",
      label: "Prenom",
    },
    { path: "cabinetId.nom", label: "Cabinet" },
    { path: "natureActeId.nom", label: "Acte" },
    {
      path: "modePaiement",
      label: "Mode Paiement",
    },
    {
      path: "datePaiement",
      label: "Date",
      date: (paiement) => {
        if (
          paiement.datePaiement !== undefined &&
          paiement.datePaiement !== null
        )
          return (
            <Moment date={paiement.datePaiement} format="DD/MM/YYYY">
              {paiement.datePaiement}
            </Moment>
          );
      },
    },

    {
      path: "montant",
      label: "Montant",
    },
  ];
  const itemActions = (
    <div className=" my-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#6d71be47] shadow-md ">
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
      selectedItems={selectedItems}
      onSort={onSort}
      onItemsSelect={onItemsSelect}
      sortColumn={sortColumn}
    />
  );
}

export default PaiementsTable;
