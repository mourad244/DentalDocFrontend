import React, { useState } from "react";

import MenuReport from "./menuReport";
import ReportForm from "./reportForm";
import SearchPatient from "../searchPatient";

function NouveauReport() {
  const [selectedPatient, setSelectedPatient] = useState({});
  const resetSelectedPatient = () => {
    setSelectedPatient({});
  };

  const displayPatient = (patient) => {
    setSelectedPatient(patient);
  };
  return (
    <>
      <MenuReport />
      <div className="body-devi">
        <SearchPatient onPatientSelect={displayPatient} />

        {Object.keys(selectedPatient).length !== 0 ? (
          <ReportForm
            selectedPatient={selectedPatient}
            resetSelectedPatient={resetSelectedPatient}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default NouveauReport;
