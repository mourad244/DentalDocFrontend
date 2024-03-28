import React from "react";
import Table from "../../../common/table";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
function societesTable(props) {
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
      path: "nom",
      label: "Nom",
    },

    {
      path: "telephone",
      label: "télephone",
    },
    {
      path: "adresse",
      label: "Adresse",
    },
    {
      path: "ville",
      label: "Ville",
    },
    {
      path: "banque",
      label: "Banque",
    },
    // {
    //   path: "lieuOuvertureBanque",
    //   label: "Lieu d'ouverture de la banque",
    // },
    // {
    //   path: "RIB",
    //   label: "RIB",
    // },
    {
      path: "numPatente",
      label: "Numéro de patente",
    },
    // {
    //   path: "numRC",
    //   label: "Numéro de RC",
    // },
    // {
    //   path: "numIF",
    //   label: "Numéro IF",
    // },
    // {
    //   path: "numCNSS",
    //   label: "Numéro CNSS",
    // },
    // {
    //   path: "numICE",
    //   label: "Numéro ICE",
    // },
    // {
    //   path: "email",
    //   label: "Email",
    // },
    // {
    //   path: "fax",
    //   label: "Fax",
    // },
    // {
    //   path: "site",
    //   label: "Site",
    // },
    // {
    //   path: "taxPro",
    //   label: "Taxe professionnelle",
    // },
    {
      path: "description",
      label: "Description",
    },
  ];

  const {
    societes,
    onSort,
    onEdit,
    onItemSelect,
    onItemsSelect,
    sortColumn,
    selectedItem,
    selectedItems,
    onDelete,
  } = props;
  const itemActions = (
    <div className="m-1 mt-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#D6E1E3] shadow-md ">
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
      columns={columns}
      data={societes}
      onItemsSelect={onItemsSelect}
      selectedItems={selectedItems}
      selectedItem={selectedItem}
      sortColumn={sortColumn}
      onSort={onSort}
      itemActions={itemActions}
    />
  );
}

export default societesTable;
