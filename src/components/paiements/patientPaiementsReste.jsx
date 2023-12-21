import React from "react";
import "./patientPaiementsReste.css";
function PatientPaiementsReste(props) {
  const { selectedPatient, montantPayeSoins, montantPayeProtheses } = props;

  const balanceSoins =
    selectedPatient.montantAPayerSoins -
    montantPayeSoins -
    (selectedPatient.report.recetteSoins || 0);
  const balanceProtheses =
    selectedPatient.montantAPayerProtheses -
    montantPayeProtheses -
    (selectedPatient.report.recetteProtheses || 0);
  return (
    <div
      className={
        selectedPatient.report.isAJour
          ? " table-patient-acte table-acte-effectue component reste-component-ras"
          : "table-patient-acte table-acte-effectue component reste-component-manque "
      }
    >
      <h1 className="component-title title-in-middle">Reste à payé</h1>

      <div className="report-line">
        <div className="reste-a-paye total-montant">
          <h3>Soins</h3>
          <label htmlFor="restant">{balanceSoins} Dh</label>
        </div>
        <div className="reste-a-paye total-montant">
          <h3>Prothèses</h3>
          <label htmlFor="restant">{balanceProtheses} Dh</label>
        </div>
      </div>
    </div>
  );
}
export default PatientPaiementsReste;
