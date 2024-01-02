import React, { useState, useEffect } from "react";

import { getRdv } from "../../services/rdvServices";
import { getPatients } from "../../services/patientService";

import { useHistory } from "react-router-dom";

import AgendaRdv from "./agendaRdv";

import SearchBox from "../../common/searchBox";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import Input from "../../common/input";

function RdvForm(props) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [selectedRdv, setSelectedRdv] = useState({});
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      if (props.match.params.id !== "new") {
        const { data: rdvData } = await getRdv(props.match.params.id);
        setSelectedPatient(rdvData.patientId);
        setSelectedRdv(rdvData);
      } else {
        const { data: patientsData } = await getPatients();
        setPatients(patientsData);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterPatients = () => {
      const newFilteredPatients = patients.filter((patient) => {
        return (
          patient.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.prenom.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      searchQuery === ""
        ? setFilteredPatients([])
        : setFilteredPatients(newFilteredPatients);
    };
    filterPatients();
  }, [searchQuery]);

  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
      <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
        Nouveau Rendez-vous
      </p>
      <div className="ml-2  flex justify-start">
        <button
          className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
          onClick={() => {
            history.push("/rdvs");
          }}
        >
          <IoChevronBackCircleSharp className="mr-1 " />
          Retour à la Liste
        </button>
      </div>
      {/* get the params.id */}

      {props.match.params.id === "new" && (
        <div className="m-2 flex min-w-fit  rounded-sm bg-[#aab9d1] pb-2  pt-2 shadow-md ">
          <div className="mr-3 h-[40px] w-28 text-right text-xs font-bold leading-9 text-[#72757c]">
            Chercher un patient
          </div>
          <div className="flex w-fit items-start ">
            <SearchBox
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e);
              }}
            />
            <div className="flex flex-wrap">
              {filteredPatients.map((patient) => (
                <div
                  className=" w-fit cursor-pointer  items-center justify-between pl-2  hover:bg-[#e6e2d613]"
                  key={patient._id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setFilteredPatients([]);
                    setSearchQuery("");
                  }}
                >
                  <p className=" mb-1 rounded-md bg-slate-400 p-2 text-xs font-bold leading-4">
                    {`${patient.nom} ${patient.prenom}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {Object.keys(selectedPatient).length !== 0 && (
        <>
          <div className="m-2 w-fit rounded-sm bg-slate-400 p-2">
            <p className="text-xs font-bold">{`Patient: ${selectedPatient.nom} ${selectedPatient.prenom}`}</p>
          </div>
          <AgendaRdv
            selectedPatient={selectedPatient}
            selectedRdv={selectedRdv}
          />
        </>
      )}
    </div>
  );
}

export default RdvForm;
