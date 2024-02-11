import React from "react";

import TableHeader from "../../common/tableHeader";
import RdvTableBody from "./rdvTableBody";

import { TbDental } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";
import { AiFillDelete } from "react-icons/ai";
import { AiTwotoneEdit } from "react-icons/ai";

import Moment from "react-moment";

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
            {rdv.patientId && rdv.patientId.nom}{" "}
            {rdv.patientId && rdv.patientId.prenom}
          </label>
        );
      },
    },

    {
      path: "patientId.telephone",
      label: "Télephone",
    },
    {
      path: "isHonnore",
      label: "Honnoré?",
      content: (rdv) => {
        if (rdv.isAnnule) return <label key={rdv._id}>Annulé</label>;
        if (rdv.isReporte) {
          return (
            <label key={rdv._id}>
              Reporté au{" "}
              <Moment format="DD/MM/YYYY">{rdv.dateNouveauRdv}</Moment>
            </label>
          );
        }
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
    {
      path: "deviId.numOrdre",
      label: "N° Devis",
    },
  ];

  const {
    rdvs,
    onSort,
    sortColumn,
    onEdit,
    onCancel,
    onAddDevi,
    onItemSelect,
    onItemsSelect,
    // onViewDetails,
    selectedItems,
    selectedItem,
    onDelete,
  } = props;
  const itemActions = (
    <div className="mt-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#6d71be47] shadow-md ">
      <TbDental
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onAddDevi === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={onAddDevi}
        title="Ajouter un devis"
      />

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
