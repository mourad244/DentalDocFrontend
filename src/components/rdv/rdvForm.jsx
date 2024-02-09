import React, { useState, useEffect } from "react";

import { getRdv, deleteRdv, saveRdv } from "../../services/rdvServices";
import { getPatients } from "../../services/patientService";

import { useHistory } from "react-router-dom";

import AgendaRdv from "./agendaRdv";

import SearchBox from "../../common/searchBox";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { getNatureActes } from "../../services/natureActeService";
import { getActeDentaires } from "../../services/acteDentaireService";

function RdvForm(props) {
  const [actes, setActes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [natureActes, setNatureActes] = useState([]);

  const [selectedRdv, setSelectedRdv] = useState({});
  const [selectedPatient, setSelectedPatient] = useState({});
  const [selectedNatureActe, setSelectedNatureActe] = useState({});

  const [filteredActes, setFilteredActes] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [reload, setReload] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const { data: actesData } = await getActeDentaires();
      const { data: natureActesData } = await getNatureActes();

      if (props.match.params.id !== "new") {
        const { data: rdvData } = await getRdv(props.match.params.id);
        setActes(actesData);
        setSelectedRdv(rdvData);
        setNatureActes(natureActesData);
        setSelectedPatient(rdvData.patientId);
      } else {
        const { data: patientsData } = await getPatients();
        setActes(actesData);
        setPatients(patientsData);
        setNatureActes(natureActesData);
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
  useEffect(() => {
    //  set filteredActes based on selectedNatureActe
    const filterActes = () => {
      const newFilteredActes = actes.filter((acte) => {
        if (
          acte.natureId === null ||
          !selectedNatureActe ||
          !selectedNatureActe._id
        )
          return false;
        return (
          acte.natureId._id.toString() === selectedNatureActe._id.toString()
        );
      });
      setFilteredActes(newFilteredActes);
    };
    filterActes();
  }, [selectedNatureActe]);

  const onDateSelect = async (date) => {
    if (Object.keys(selectedRdv).length !== 0) {
      let oldData = {
        _id: selectedRdv._id,
        patientId: selectedPatient._id,
        datePrevu: selectedRdv.datePrevu,
        isReporte: true,
        dateNouveauRdv: date,
      };
      let newData = {
        patientId: selectedPatient._id,
        datePrevu: date,
      };

      await saveRdv(oldData);
      await saveRdv(newData);
    } else
      await saveRdv({
        patientId: selectedPatient._id,
        datePrevu: date,
      });
    setReload(true);
    history.push("/rdvs");
  };
  const onRdvDelete = async (rdvId) => {
    await deleteRdv(rdvId);
    setReload(true);
    history.push("/rdvs");
  };
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
          <div className="m-2 flex min-w-fit  rounded-sm bg-[#aab9d1] pb-2  pt-2 shadow-md ">
            <div className="mr-3 h-[40px] w-28 text-right text-xs font-bold leading-9 text-[#72757c]">
              Nature Acte
            </div>
            <div className="flex w-fit items-start ">
              <select
                className="rounded-md border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner"
                onChange={(e) => {
                  setSelectedNatureActe(
                    natureActes.find(
                      (natureActe) => natureActe._id === e.target.value,
                    ),
                  );
                }}
              >
                <option value="">Choisir nature acte</option>
                {natureActes.map((natureActe) => (
                  <option key={natureActe._id} value={natureActe._id}>
                    {natureActe.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="m-2 flex min-w-fit  rounded-sm bg-[#aab9d1] pb-2  pt-2 shadow-md ">
            <div className="mr-3 h-[40px] w-28 text-right text-xs font-bold leading-9 text-[#72757c]">
              Acte
            </div>
            <div className="flex w-fit items-start ">
              <select
                className="rounded-md border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner"
                onChange={(e) => {
                  setSelectedRdv({
                    ...selectedRdv,
                    acteId: e.target.value,
                  });
                }}
              >
                <option value="">Choisir acte</option>
                {filteredActes.map((acte) => (
                  <option key={acte._id} value={acte._id}>
                    {acte.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* display duree input and suggest in placeholder the value in acte */}
          <div className="m-2 flex min-w-fit  rounded-sm bg-[#aab9d1] pb-2  pt-2 shadow-md ">
            <div className="mr-3 h-[40px] w-28 text-right text-xs font-bold leading-9 text-[#72757c]">
              Durée
            </div>
            <div className="flex w-fit items-start ">
              <input
                className="rounded-md border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner"
                type="number"
                placeholder="Durée"
                value={selectedRdv.duree}
                onChange={(e) => {
                  setSelectedRdv({
                    ...selectedRdv,
                    duree: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <AgendaRdv
            selectedPatient={selectedPatient}
            selectedRdv={selectedRdv}
            onSelectDate={onDateSelect}
            onDeleteRdv={onRdvDelete}
          />
        </>
      )}
    </div>
  );
}

export default RdvForm;
