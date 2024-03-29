import React, { useState } from "react";

import Select from "../../../common/select";
import CustomeTable from "../../../common/CustomeTable";

import Moment from "react-moment";
import { v4 as uuidv4 } from "uuid";
import { FaPrint } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";

function ArticlesTable({
  datas,
  onSort,
  onEdit,
  fields,
  onPrint,
  headers,
  articles,
  onDelete,
  totalItems,
  sortColumn,
  onItemSelect,
  onItemsSelect,
  selectedItems,
  onValueChange,
  onFieldSelect,
  selectedFilterItems,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [selectedCollapse, setSelectedCollapse] = useState("");

  const collapseFunction = (collapse) => {
    let children = <></>;
    switch (collapse) {
      case "visibleFields":
        children = visibleFields;
        break;
      case "filter":
        children = filterFunctions;
        break;
      default:
        break;
    }
    let isOpen = false;
    if (selectedCollapse === "filter" && isFilterOpen) isOpen = true;
    if (selectedCollapse === "visibleFields" && isFieldsOpen) isOpen = true;

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

  const tableRows = articles.map((article) => {
    return (
      <tr
        className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3] text-center"
        key={uuidv4()}
      >
        <td className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3] text-center">
          <input
            type="checkbox"
            checked={
              selectedItems.findIndex((c) => c._id === article._id) !== -1
            }
            onChange={() => onItemSelect(article)}
          />
        </td>

        {headers.map((header, index) => {
          const key = header.name;
          switch (key) {
            case "select":
              return null;
            case "isExpiration":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {article.isExpiration ? "Oui" : "Non"}
                </td>
              );
            case "uniteMesureId":
              let uniteMesure = datas.uniteMesures.find(
                (p) =>
                  p._id === article.uniteMesureId &&
                  article.uniteMesureId.toString(),
              );
              if (!uniteMesure) return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {uniteMesure.nom}
                </td>
              );
            case "lotId":
              let lot = datas.lots.find(
                (p) => p._id === article.lotId && article.lotId.toString(),
              );
              if (!lot) return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {lot.nom}
                </td>
              );
            case "uniteReglementaireId":
              let uniteReglementaire = datas.uniteReglementaires.find(
                (p) =>
                  p._id === article.uniteReglementaireId &&
                  article.uniteReglementaireId.toString(),
              );
              if (!uniteReglementaire) return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {uniteReglementaire.nom}
                </td>
              );
            default:
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {article[key]}
                </td>
              );
          }
        })}
      </tr>
    );
  });
  const visibleFields = (
    <div className="m-1 mt-2  flex flex-wrap rounded-sm bg-slate-300 p-1 shadow-md">
      {fields.map((field) => {
        return (
          field.name !== "select" && (
            <div className="flex" key={field.name}>
              <input
                type="checkbox"
                label={field.label}
                checked={headers.findIndex((h) => h.name === field.name) !== -1}
                onChange={() => onFieldSelect(field)}
              />
              <label className="p-1 text-xs font-medium text-[#3b3b3b]">
                {field.label}
              </label>
            </div>
          )
        );
      })}
    </div>
  );

  const filterFunctions = (
    <div className="m-1 mt-2 flex  w-full items-center gap-2 rounded-md  border-slate-300 bg-[#D6E1E3] shadow-md ">
      <div className="m-2">
        <Select
          options={[
            {
              _id: "oui",
              nom: "Oui",
            },
            {
              _id: "non",
              nom: "Non",
            },
          ]}
          label="Expiration ?"
          name={"isExpiration"}
          onChange={(e) => {
            onValueChange("isExpiration", e);
          }}
          width={200}
          widthLabel={100}
          height={40}
          value={
            selectedFilterItems.isExpiration
              ? "oui"
              : selectedFilterItems.isExpiration === false
              ? "non"
              : ""
          }
        />
      </div>
    </div>
  );
  const toggleVisibleFields = () => {
    setIsFieldsOpen(!isFieldsOpen);
    setSelectedCollapse(isFieldsOpen ? "" : "visibleFields");
    setIsCollapseOpen(!isCollapseOpen);
    setIsFilterOpen(false);
  };
  /*  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setSelectedCollapse(isFilterOpen ? "" : "filter");
    setIsCollapseOpen(!isCollapseOpen);
    setIsFieldsOpen(false);
  }; */

  const collapseButton = (
    <div className="flex flex-col gap-2 ">
      <div className="flex w-fit flex-row items-center gap-2">
        {/*  <button
          onClick={toggleFilter}
          className="rounded-sm bg-slate-300 p-1 shadow-md"
        >
          <span className="text-xs font-medium md:block">Filter</span>
        </button> */}
        <button
          onClick={toggleVisibleFields}
          className="rounded-sm bg-slate-300 p-1 shadow-md"
        >
          <span className="text-xs font-medium md:block">Champs affichés</span>
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
        title="Imprimer"
        color="#474a52"
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
export default ArticlesTable;
