import React from "react";
import Table from "../../common/table";
import Moment from "react-moment";
import "./patientPaiementsTable.css";
import "../paiements/patientAPayeTable.css";

function PatientPaiementsTable(props) {
  const columns = [
    {
      path: "numRecu",
      label: "N° Reçu",
    },
    {
      path: "natureActeId",
      label: "Nature",
      content: (paiement) => {
        // find in props.natureActes the natureActeId  and return nom
        const natureActe = props.natureActes.find(
          (natureActe) => natureActe._id === paiement.natureActeId
        );
        return natureActe ? natureActe.nom : "";
      },
    },
    {
      path: "modePaiement",
      label: "Mode Paiement",
    },
    {
      path: "datePaiement",
      label: "Date Paiement",
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
      content: (paiement) => {
        return `${paiement.montant} Dh`;
      },
    },
  ];
  const {
    paiements,
    onSort,
    sortColumn,
    selectedPatient,
    montantPayeSoins,
    montantPayeProtheses,
  } = props;
  return (
    <div className=" table-patient-acte table-acte-effectue component">
      <h1 className="component-title title-in-middle">Paiements</h1>

      <h2 className="second-title">Report</h2>
      {selectedPatient.report.isAJour ? (
        <div className="report-line">
          <div className="reste-a-paye total-montant">
            <h3>Soins</h3>
            <label htmlFor="restant">
              {selectedPatient.report.recetteSoins} Dh
            </label>
          </div>

          <div className="reste-a-paye total-montant">
            <h3>Prothèses</h3>
            <label htmlFor="restant">
              {selectedPatient.report.recetteProtheses} Dh
            </label>
          </div>
        </div>
      ) : (
        <div className="report-line">
          <div className="reportMontant total-montant">
            <h3>Soins</h3>
            <label className="reportMontant-warning">A mettre à jour</label>
          </div>
          <div className="reportMontant total-montant">
            <h3>Prothèses</h3>
            <label className="reportMontant-warning">A mettre à jour</label>
          </div>
        </div>
      )}

      <h2 className="second-title">Liste des paiements éffectues</h2>
      <div className="component-body">
        <div className="global-montant">
          <Table
            columns={columns}
            data={paiements}
            sortColumn={sortColumn}
            onSort={onSort}
          />
        </div>
      </div>
      <div className="calculate-total">
        <h2 className="second-title">Total des paiements</h2>
        <div className="report-line">
          <div className="totalPaiements total-montant">
            <h3>Soins</h3>
            <label htmlFor="montantActes">{montantPayeSoins} Dh</label>
          </div>
          <div className="totalPaiements total-montant">
            <h3>Prothèses</h3>
            <label htmlFor="montantActes">{montantPayeProtheses} Dh</label>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PatientPaiementsTable;
