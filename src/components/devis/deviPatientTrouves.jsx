import React, { useState } from "react";
import "./deviPatientTrouves.css";

function DeviPatientTrouves(props) {
  const [selectedItem, setSelectedItem] = useState(null);
  const { patients } = props;
  return (
    <div className="component deviPatientTrouve-component">
      <h1 className="component-title">Patient trouvé</h1>
      {patients.map((item) => {
        return (
          <div
            key={item._id}
            className={
              item._id === selectedItem
                ? "patient-trouve colored-item"
                : "patient-trouve"
            }
            onClick={() => {
              setSelectedItem(item._id);
              props.onPatientSelect(item);
            }}
          >
            <h4>
              Nom et Prenom : {item.nom} {item.prenom}
            </h4>
            <h4>Numero Dossier : {item.numDossier}</h4>
          </div>
        );
      })}
    </div>
  );
}

export default DeviPatientTrouves;
