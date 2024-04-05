import React from "react";

import CustomeTable from "../../common/CustomeTable";

import Moment from "react-moment";
import { v4 as uuidv4 } from "uuid";
import { FaPrint } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { AiTwotoneEdit } from "react-icons/ai";

function PaiementBCsTable({
  paiementBCs,
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
  const tableRows = paiementBCs.map((paiementBC) => {
    return (
      <tr
        className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center"
        key={uuidv4()}
      >
        <td className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center">
          <input
            type="checkbox"
            checked={
              selectedItems.findIndex((c) => c._id === paiementBC._id) !== -1
            }
            onChange={() => onItemSelect(paiementBC)}
          />
        </td>

        {headers.map((header, index) => {
          const key = header.name;
          switch (key) {
            case "select":
              return null;
            case "montant":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {paiementBC.montant
                    ? `${paiementBC.montant} Dh`
                    : `Non défini`}
                </td>
              );
            case "societeRetenuId":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {paiementBC.societeRetenuId.nom}{" "}
                  {paiementBC.societeRetenuId.prenom}
                </td>
              );

            case "date":
              if (paiementBC.date === undefined) return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  <Moment date={paiementBC.date} format="DD/MM/YYYY">
                    {paiementBC.date}
                  </Moment>
                </td>
              );
            default:
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {paiementBC[key]}
                </td>
              );
          }
        })}
      </tr>
    );
  });

  const itemActions = (
    <div className=" my-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#D6E1E3] shadow-md ">
      <AiTwotoneEdit
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onEdit === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={onEdit}
        color="#474a52"
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
        color="#FF4D4D"
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
      onSort={onSort}
      onItemsSelect={onItemsSelect}
      sortColumn={sortColumn}
    />
  );
}

export default PaiementBCsTable;
