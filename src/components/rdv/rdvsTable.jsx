import React from "react";
import Table from "../../common/table";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import "./rdvs.css";

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
            {rdv.patientId.gradeId ? rdv.patientId.gradeId.nom : " "}
            {rdv.patientId.nom} {rdv.patientId.prenom}
          </label>
        );
      },
    },

    {
      path: "patientId.telephone",
      label: "Télephone",
    },
    {
      path: "medecinId.nom",
      label: "Medecin",
    },
    //           isHonnore: false,
    {
      path: "isHonnore",
      label: "Honnoré?",
      content: (rdv) => {
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
    onItemSelect,
    onItemsSelect,
    // onViewDetails,
    selectedItems,
    selectedItem,
    onDelete,
  } = props;
  const itemActions = (
    <div className="m-1 mt-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#6d71be47] shadow-md ">
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
    </div>
  );
  return (
    <Table
      data={rdvs}
      columns={columns}
      sortColumn={sortColumn}
      onSort={onSort}
      onItemsSelect={onItemsSelect}
      selectedItems={selectedItems}
      selectedItem={selectedItem}
      itemActions={itemActions}
    />
  );
}

export default RdvsTable;
