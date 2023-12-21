import React from "react";
import Table from "../../common/table";
import Moment from "react-moment";
// import { v4 as uuidv4 } from "uuid";
// import "./actesEffectuesTable.css";
import "./patientAPayeTable.css";

function PatientAPayeTable(props) {
  const columns = [
    //    code: "",
    { path: "code", label: "Code Acte" },
    //           nature: "",
    { path: "nature", label: "Nature Acte" },
    //           medecin: "",
    { path: "medecin", label: "Medecin" },
    //           dents: [],
    // { path: "dents", label: "Dents" },
    //           date: "",
    {
      path: "date",
      label: "Date",
      date: (acte) => {
        if (acte.date !== undefined && acte.date !== null)
          return (
            <Moment date={acte.date} format="DD/MM/YYYY">
              {acte.date}
            </Moment>
          );
      },
    },
    //           prix: "",
    {
      path: "prix",
      label: "Prix",
      content: (acte) => {
        return `${acte.prix} Dh`;
      },
    },
    //           isPaye: false,
    // {
    //   path: "isPaye",
    //   label: "Payé",
    //   content: (acte) => {
    //     return (
    //       <input
    //         key={uuidv4()}
    //         type="checkbox"
    //         checked={acte.isPaye}
    //         onChange={() => {
    //           (!acte.isPaye
    //             ? window.confirm("Confirmer le paiement")
    //             : window.confirm("Confirmer l'annulation du paiement")) &&
    //             props.onCheck(acte._id);
    //         }}
    //       />
    //     );
    //   },
    // },
  ];

  const { actesEffectues, onSort, sortColumn, selectedPatient } = props;
  return (
    <div className=" table-patient-acte table-acte-effectue component">
      <h1 className="component-title title-in-middle ">Actes</h1>
      <div className="report-acte">
        <h2 className="second-title">Report</h2>
        {selectedPatient.report.isAJour ? (
          <div className="report-line">
            <div className="reportMontant total-montant">
              <h3>Soins</h3>
              <label className="reportMontant">
                {selectedPatient.report.acteSoins} Dh
              </label>
            </div>
            <div className="reportMontant total-montant">
              <h3>Prothèses</h3>
              <label className="reportMontant">
                {selectedPatient.report.acteProtheses} Dh
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
      </div>

      <h2 className="second-title">Liste des actes éffectues</h2>
      <div className="component-body">
        <div className="global-montant no-color-items">
          <Table
            columns={columns}
            data={actesEffectues}
            sortColumn={sortColumn}
            onSort={onSort}
          />
        </div>
      </div>
      <div className="calculate-total">
        <h2 className="second-title">Total des actes</h2>

        <div className="report-line">
          <div className="totalActes total-montant">
            <h3>Soins</h3>
            <label htmlFor="montantActes">
              {selectedPatient.montantAPayerSoins} Dh
            </label>
          </div>
          <div className="totalActes total-montant">
            <h3>Prothèses</h3>
            <label htmlFor="montantActes">
              {selectedPatient.montantAPayerProtheses} Dh
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientAPayeTable;
