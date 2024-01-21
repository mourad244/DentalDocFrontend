import React from "react";
import Table from "../../common/table";
import { AiTwotoneEdit } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import { AiFillDelete } from "react-icons/ai";
import RdvTableBody from "./rdvTableBody";
import TableHeader from "../../common/tableHeader";

function RdvsTable(props) {
  const columns = [
    {
      path: "select",
      label: "Select",
      content: (item) => {
        return (
          <input
            type="checkbox"
            checked={selectedItems.findIndex((c) => c._id === item._id) !== -1}
            onChange={() => onItemSelect(item)}
          />
        );
      },
    },
    {
      path: "patientId.nom",
      label: "Patient",
      content: (rdv) => {
        return (
          <label key={rdv._id}>
            {rdv.patientId.nom} {rdv.patientId.prenom}
          </label>
        );
      },
    },

    {
      path: "patientId.telephone",
      label: "Télephone",
    },
    // {
    //   path: "medecinId.nom",
    //   label: "Medecin",
    // },
    //           isHonnore: false,
    {
      path: "isHonnore",
      label: "Honnoré?",
      content: (rdv) => {
        if (rdv.isAnnule) return <label key={rdv._id}>Annulé</label>;
        return (
          <input
            key={rdv._id}
            type="checkbox"
            checked={rdv.isHonnore}
            onChange={() => {
              props.onCheck(rdv._id);
            }}
          />
        );
      },
    },
  ];

  const {
    rdvs,
    onSort,
    sortColumn,
    onEdit,
    onCancel,
    onItemSelect,
    onItemsSelect,
    // onViewDetails,
    selectedItems,
    selectedItem,
    onDelete,
  } = props;
  const itemActions = (
    <div className="mt-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#6d71be47] shadow-md ">
      <AiTwotoneEdit
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onEdit === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={onEdit}
        title="Modifier"
      />

      <TiCancel
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onCancel === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={onCancel}
        title="Annuler"
      />

      <AiFillDelete
        className={`h-6 w-7 cursor-pointer rounded-md   p-1 shadow-md  ${
          onDelete === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={() => {
          window.confirm("Confirmer la suppression") && onDelete(selectedItems);
        }}
        title="Supprimer"
      />
    </div>
  );
  return (
    <>
      {itemActions}
      <table className=" my-2 h-fit w-full">
        <TableHeader
          columns={columns}
          isAllSelectedItems={
            selectedItems && rdvs.length === selectedItems.length && rdvs.length
          }
          sortColumn={sortColumn}
          onItemsSelect={onItemsSelect}
          onSort={onSort}
        />
        <RdvTableBody columns={columns} data={rdvs} />
      </table>
    </>
  );
}

export default RdvsTable;
