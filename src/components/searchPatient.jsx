import React, { useState, useEffect } from "react";
import DeviPatientTrouves from "./devis/deviPatientTrouves";

import SearchBox from "../common/searchBox";
import SearchButton from "../assets/buttons/searchButton";
import ClipLoader from "react-spinners/ClipLoader";

import { searchPatient } from "../services/searchPatientService";

function SearchPatient(props) {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchData = async () => {
      setLoading(true);
      const { data: patientsData } = await searchPatient(searchQuery);
      setPatients(patientsData);
      setIsStarting(false);
      setLoading(false);
    };
    if (isStarting) searchData();
  }, [isStarting, searchQuery]);

  const handleSearch = (query) => {
    setIsStarting(false);
    setSearchQuery(query);
  };
  const startSearch = () => {
    setIsStarting(true);
  };
  const displayPatient = (patient) => {
    props.onPatientSelect(patient);
  };
  return (
    <>
      <div className="component devi-component">
        <h1 className="component-title">Chercher un patient</h1>
        <p>chercher par: Numéro Dossier, CIN ou nom</p>
        <SearchBox value={searchQuery} onChange={handleSearch} />
        <SearchButton handleSearch={startSearch} />
      </div>
      {loading ? (
        <div className="component deviPatientTrouve-component">
          <div className="spinner">
            <ClipLoader size={150} color={"#123abc"} loading={loading} />
          </div>
        </div>
      ) : (
        <DeviPatientTrouves
          patients={patients}
          onPatientSelect={displayPatient}
        />
      )}
    </>
  );
}

export default SearchPatient;
