import React from "react";
import Table from "../../common/table";
import Moment from "react-moment";

import "./paiementsTable.css";

function PaiementsTable(props) {
  const columns = [
    {
      path: "patientId.adherenceId.nom",
      label: "Adherence",
    },
    {
      path: "patientId.gradeId.nom",
      label: "Grade",
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

  const { paiements, onSort, sortColumn } = props;
  return (
    <Table
      columns={columns}
      data={paiements}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
}

export default PaiementsTable;
