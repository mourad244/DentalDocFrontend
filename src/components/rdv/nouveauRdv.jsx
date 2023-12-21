import React, { useState, useEffect } from "react";

import { getMedecins } from "../../services/medecinService";

import AgendaRdv from "./agendaRdv";
import SearchPatient from "../searchPatient";

import "./nouveauRdv.css";

function NouveauRdv() {
  const [medecins, setMedecins] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState("");
  const [selectedMedecin, setSelectedMedecin] = useState({});
  const [selectedPatient, setSelectedPatient] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: medecinsData } = await getMedecins();
      setMedecins(medecinsData);
    };
    fetchData();
  }, []);

  const displayPatient = (patient) => {
    if (patient.prochainRdv && patient.prochainRdv.medecinId)
      setSelectedMedecin(patient.prochainRdv.medecinId);
    setSelectedPatient(patient);
  };
  const handleMedecinSelect = (e) => {
    setSelectedMedecin(e.target.value);
  };

  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
      <div className="body-devi">
        <SearchPatient onPatientSelect={displayPatient} />
      </div>
      {Object.keys(selectedPatient).length !== 0 ? (
        <div className="component medecin-select-component">
          <h1 className="component-title">Selectionner un medecin</h1>
          <div className="select-component">
            <select id="medecins" onClick={handleMedecinSelect} name="medecins">
              <option
                value={
                  selectedPatient.prochainRdv &&
                  selectedPatient.prochainRdv.medecinId
                    ? selectedPatient.prochainRdv.medecinId._id ||
                      selectedPatient.prochainRdv.medecinId
                    : ""
                }
              >
                {selectedPatient.prochainRdv &&
                selectedPatient.prochainRdv.medecinId
                  ? selectedPatient.prochainRdv.medecinId.nom
                  : ""}
              </option>
              ;
              {medecins.map((option) => {
                return (
                  <option key={option._id || option.nom} value={option._id}>
                    {option.nom}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      ) : (
        ""
      )}
      {Object.keys(selectedMedecin).length !== 0 ? (
        <AgendaRdv
          selectedPatient={selectedPatient}
          selectedMedecin={selectedMedecin}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default NouveauRdv;
