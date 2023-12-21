import React from "react";
import Table from "../../common/table";
import Moment from "react-moment";

import "./devisTable.css";

function DevisTable(props) {
  // nom, prenom, grade, telephone, adherence, date ouverture dossier
  const columns = [
    { path: "numOrdre", label: "N° devi" },
    {
      path: "patientId",
      label: "Patient",
      content: (devi) => {
        return `${devi.patientId.nom} ${devi.patientId.prenom}`;
      },
    },
    {
      path: "date",
      label: "Date",
      date: (devi) => {
        if (devi.dateDevi !== undefined && devi.dateDevi !== null)
          return (
            <Moment date={devi.dateDevi} format="DD/MM/YYYY">
              {devi.dateDevi}
            </Moment>
          );
      },
    },
    {
      path: "prix",
      label: "Prix",
      content: (devi) => (devi.prix ? `${devi.prix} Dh` : ""),
    },
    {
      path: "medecinId",
      label: "Medecin",
      content: (devi) => {
        return devi.medecinId
          ? `${devi.medecinId.gradeId ? devi.medecinId.gradeId.nom : ""} ${
              devi.medecinId.nom ? devi.medecinId.nom : ""
            } ${devi.medecinId.prenom ? devi.medecinId.prenom : ""}`
          : "";
      },
    },
    { path: "cabinetId.nom", label: "Cabinet" },
  ];

  const { devis, onSort, sortColumn } = props;
  return (
    <Table
      columns={columns}
      data={devis}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
}

export default DevisTable;
