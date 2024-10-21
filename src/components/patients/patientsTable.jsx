import React, { useState } from "react";

import Select from "../../common/select";
import CustomeTable from "../../common/CustomeTable";

import Moment from "react-moment";
import { v4 as uuidv4 } from "uuid";
import { FaPrint } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";

function PatientsTable({
  datas,
  onSort,
  onEdit,
  fields,
  onPrint,
  headers,
  patients,
  onDelete,
  totalItems,
  sortColumn,
  onItemSelect,
  onItemsSelect,
  selectedItems,
  onValueChange,
  user,
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

  const tableRows = patients.map((patient) => {
    return (
      <tr
        className={`h-12 border-y-2 text-center ${
          patient.isMasculin ? "bg-[#94b9f5]" : "bg-[#f78bc6]"
        }`}
        key={uuidv4()}
      >
        <td className="h-12 border-y-2 text-center">
          <input
            type="checkbox"
            checked={
              selectedItems.findIndex((c) => c._id === patient._id) !== -1
            }
            onChange={() => onItemSelect(patient)}
          />
        </td>

        {headers.map((header, index) => {
          const key = header.name;
          switch (key) {
            case "select":
              return null;
            // case of nom, with Capitale letter
            case "nom":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {patient.nom.toUpperCase()}
                </td>
              );
            // case of prenom, with Capital letter first letter
            case "prenom":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {patient.prenom.charAt(0).toUpperCase() +
                    patient.prenom.slice(1).toLowerCase()}
                </td>
              );
            case "age":
              if (patient.dateNaissance !== undefined) {
                var today = new Date();
                var birthDate = new Date(patient.dateNaissance);
                var age_now = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (
                  m < 0 ||
                  (m === 0 && today.getDate() < birthDate.getDate())
                ) {
                  age_now--;
                }

                return (
                  <td
                    key={uuidv4()}
                    className="px-1 text-xs font-medium text-[#2f2f2f]"
                  >
                    {age_now}
                  </td>
                );
              }
              return <td key={uuidv4()} />;
            case "dateNaissance":
              if (patient.dateNaissance === undefined)
                return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  <Moment date={patient.dateNaissance} format="DD/MM/YYYY">
                    {patient.dateNaissance}
                  </Moment>
                </td>
              );
            case "prochainRdv":
              if (
                patient.prochainRdv === undefined ||
                patient.prochainRdv.date === undefined
              )
                return <td key={uuidv4()} />;
              var date = new Date(patient.prochainRdv.date);
              var options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              };
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {date.toLocaleDateString("fr-FR", options)}
                </td>
              );

            case "genre":
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {patient.isMasculin ? "Homme" : "Femme"}
                </td>
              );
            case "provinceId":
              let province = datas.provinces.find(
                (p) =>
                  p._id === patient.provinceId && patient.provinceId.toString(),
              );
              if (!province) return <td key={uuidv4()} />;
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {province.nom}
                </td>
              );
            default:
              return (
                <td
                  key={uuidv4()}
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                >
                  {patient[key]}
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
              _id: "masculin",
              nom: "Masculin",
            },
            {
              _id: "feminin",
              nom: "Féminin",
            },
          ]}
          label="Genre"
          name={"isMasculin"}
          onChange={(e) => {
            onValueChange("isMasculin", e);
          }}
          width={200}
          widthLabel={100}
          height={40}
          value={
            selectedFilterItems.isMasculin
              ? "masculin"
              : selectedFilterItems.isMasculin === false
              ? "feminin"
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
      {user === "admin" && (
        <AiFillDelete
          className={`h-6 w-7 cursor-pointer rounded-md   p-1 shadow-md  ${
            onDelete === undefined ? "pointer-events-none opacity-50 " : ""
          }`}
          onClick={() => {
            window.confirm("Confirmer la suppression") &&
              onDelete(selectedItems);
          }}
          color="#FF4D4D"
          title="Supprimer"
        />
      )}
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
export default PatientsTable;
