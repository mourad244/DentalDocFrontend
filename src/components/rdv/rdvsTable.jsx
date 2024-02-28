import React from "react";

import TableHeader from "../../common/tableHeader";
import RdvTableBody from "./rdvTableBody";

import { TbDental } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";
import { AiFillDelete } from "react-icons/ai";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdOutlineScheduleSend } from "react-icons/md";

import Moment from "react-moment";
const formatTime = (hour, minute) => {
  let hourStr = hour.toString().padStart(2, "0");
  let minuteStr = minute.toString().padStart(2, "0");
  return minuteStr === "00" ? `${hourStr}h` : `${hourStr}:${minuteStr}`;
};
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
      path: "heureDebut",
      label: "Heure",
      content: (rdv) => {
        return (
          <div key={rdv._id}>
            <label>
              {rdv.heureDebut
                ? formatTime(rdv.heureDebut.heure, rdv.heureDebut.minute)
                : ""}{" "}
              -{" "}
              {rdv.heureFin
                ? formatTime(rdv.heureFin.heure, rdv.heureFin.minute)
                : ""}
            </label>
          </div>
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
      path: "patientId.acteId",
      label: "Acte",
      content: (rdv) => {
        return (
          <label key={rdv._id}>
            {rdv.acteId && rdv.acteId.nom
              ? rdv.acteId.nom.length > 50
                ? rdv.acteId.nom.substring(0, 50) + "..."
                : rdv.acteId.nom
              : ""}
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
    onPostpone,
    onCancel,
    onAddDevi,
    onItemSelect,
    onItemsSelect,
    // onViewDetails,
    selectedItems,
    // selectedItem,
    onDelete,
  } = props;
  const itemActions = (
    <div className="mt-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#D6E1E3] shadow-md ">
      <TbDental
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onAddDevi === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        color="#28A54B"
        onClick={onAddDevi}
        title="Ajouter un devis"
      />

      <AiTwotoneEdit
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onEdit === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        color="#34707D"
        onClick={onEdit}
        title="Modifier"
      />
      <MdOutlineScheduleSend
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onPostpone === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        color="#D78C47"
        onClick={onPostpone}
        title="Reporter"
      />

      <TiCancel
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onCancel === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        color="#D76947"
        onClick={onCancel}
        title="Annuler"
      />

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
