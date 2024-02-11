import React, { useState, useEffect } from "react";

import { getRdv, deleteRdv, saveRdv } from "../../services/rdvServices";
import { getPatients } from "../../services/patientService";

import { useHistory } from "react-router-dom";

import AgendaRdv from "./agendaRdv";

import SearchBox from "../../common/searchBox";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { getNatureActes } from "../../services/natureActeService";
import { getActeDentaires } from "../../services/acteDentaireService";
import Select from "../../common/select";
import Input from "../../common/input";
import Checkbox from "../../common/checkbox";

function RdvForm(props) {
  const [actes, setActes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [natureActes, setNatureActes] = useState([]);

  const [selectedRdv, setSelectedRdv] = useState({});
  const [selectedPatient, setSelectedPatient] = useState({});
  const [selectedNatureActe, setSelectedNatureActe] = useState({});
  const [selectedActe, setSelectedActe] = useState({});
  const [selectedDuree, setSelectedDuree] = useState(0);
  const [selectedMomemts, setSelectedMoments] = useState([]);
  const [selectedHeureDebut, setSelectedHeureDebut] = useState({
    heure: 0,
    minute: 0,
  });
  const [selectedHeureFin, setSelectedHeureFin] = useState({
    heure: 0,
    minute: 0,
  });

  const [filteredActes, setFilteredActes] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedRdvDate, setSelectedRdvDate] = useState("");
  const isRdvModified = props.match.params.id !== "new";
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
    setSelectedRdvDate(date);
    /* if (Object.keys(selectedRdv).length !== 0) {
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
    history.push("/rdvs"); */
  };
  const onRdvDelete = async (rdvId) => {
    await deleteRdv(rdvId);
    history.push("/rdvs");
  };
  const calculateEndTime = (startHour, startMinute) => {
    // Convert parameters to integers to ensure proper calculations
    startHour = parseInt(startHour, 10);
    startMinute = parseInt(startMinute, 10);
    const duration = parseInt(selectedDuree, 10); // Ensure this is the duration in minutes

    let endTimeInMinutes = startHour * 60 + startMinute + duration;
    let endHour = Math.floor(endTimeInMinutes / 60);
    const endMinute = endTimeInMinutes % 60;

    // If endHour reaches 24, wrap it to 0 (midnight), and so forth
    endHour = endHour % 24;

    // Convert endHour back to a string, adding leading zero if necessary
    const endHourStr = endHour.toString().padStart(2, "0");
    const endMinuteStr = endMinute.toString().padStart(2, "0");

    setSelectedHeureFin({
      heure: endHourStr,
      minute: endMinuteStr,
    });
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
          <div className="m-2 flex flex-wrap  rounded-sm bg-[#aab9d1] pb-2  pt-2 shadow-md ">
            <div className="mt-3">
              <Select
                name="natureActe"
                label="Nature Acte"
                value={selectedNatureActe ? selectedNatureActe._id : ""}
                options={natureActes}
                onChange={(e) => {
                  const natureActe = natureActes.find(
                    (natureActe) => natureActe._id === e.target.value,
                  );
                  if (natureActe) {
                    setSelectedNatureActe(natureActe);
                    setSelectedActe({});
                    setSelectedDuree(0);
                    setSelectedMoments([]);
                  } else {
                    setSelectedNatureActe({});
                    setSelectedActe({});
                    setSelectedDuree(0);
                    setSelectedMoments([]);
                  }
                }}
                widthLabel={96}
                // width={150}
                height={35}
              />
            </div>
            {selectedNatureActe && (
              <div className="mt-3">
                <Select
                  name="acte"
                  label="Acte"
                  value={selectedActe ? selectedActe._id : ""}
                  options={filteredActes}
                  onChange={(e) => {
                    let acte = actes.find(
                      (acte) => acte._id === e.target.value,
                    );
                    setSelectedActe(acte);
                    setSelectedDuree(acte && acte.duree ? acte.duree : 0);
                    setSelectedMoments(
                      acte && acte.moments ? acte.moments : [],
                    );
                  }}
                  widthLabel={96}
                  width={300}
                  height={35}
                />
              </div>
            )}
            {selectedActe && (
              <div className="mt-3">
                <Input
                  name="duree"
                  label="Durée"
                  value={
                    selectedRdv && selectedRdv.duree
                      ? selectedRdv.duree
                      : selectedDuree
                  }
                  onChange={(e) => {
                    setSelectedDuree(e.target.value);
                  }}
                  type="number"
                  widthLabel={96}
                  width={80}
                />
              </div>
            )}
            {selectedActe && (
              <div className="mt-3">
                <Checkbox
                  name={"moments"}
                  label={"Moments"}
                  widthLabel={96}
                  width={150}
                  listItems={["matin", "apres-midi"]}
                  labelItems={["Matin", "Après-midi"]}
                  value={selectedMomemts}
                  onChange={(name, value, isChecked) => {
                    let data = [...selectedMomemts];
                    if (isChecked) {
                      if (!data.includes(value)) {
                        data.push(value);
                      }
                    } else {
                      data = data.filter((item) => item !== value);
                    }
                    setSelectedMoments(data);
                  }}
                />
              </div>
            )}
          </div>

          <AgendaRdv
            selectedRdv={selectedRdv}
            onDeleteRdv={onRdvDelete}
            onSelectDate={onDateSelect}
            selectedDuree={selectedDuree}
            selectedPatient={selectedPatient}
            selectedRdvDate={selectedRdvDate}
            selectedMoments={selectedMomemts}
          />
          {/* heure debut includes two inputs: heure et minute */}
          {selectedRdvDate && (
            <div>
              <div className=" m-3 flex">
                <label className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]">
                  Début
                </label>
                <div className="flex items-center">
                  <div className="ml-2">
                    <Input
                      name="heureDebut"
                      value={
                        selectedRdv && selectedRdv.heureDebut
                          ? selectedRdv.heureDebut.heure
                          : selectedHeureDebut.heure
                      }
                      onChange={(e) => {
                        const newHour = e.target.value;
                        setSelectedHeureDebut((prevState) => ({
                          ...prevState,
                          heure: newHour,
                        }));
                        // Directly use newHour in calculateEndTime call to ensure up-to-date calculation
                        calculateEndTime(newHour, selectedHeureDebut.minute);
                      }}
                      type="number"
                      width={80}
                      max={23}
                      label="Heure"
                      height={35}
                    />
                  </div>
                  <div className="ml-2">
                    <Input
                      name="minuteDebut"
                      value={
                        selectedRdv && selectedRdv.heureDebut
                          ? selectedRdv.heureDebut.minute
                          : selectedHeureDebut.minute
                      }
                      onChange={(e) => {
                        const newMinute = e.target.value;
                        setSelectedHeureDebut((prevState) => ({
                          ...prevState,
                          minute: newMinute,
                        }));
                        // Directly use newMinute in calculateEndTime call to ensure up-to-date calculation
                        calculateEndTime(selectedHeureDebut.heure, newMinute);
                      }}
                      label="Min"
                      type="number"
                      width={80}
                      max={59}
                      height={35}
                    />
                  </div>
                </div>
              </div>
              <div className=" m-3 flex">
                <label className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]">
                  Fin
                </label>
                <div className="flex items-center">
                  <div className="ml-2">
                    <Input
                      name="heure"
                      value={
                        selectedRdv && selectedRdv.heureFin
                          ? selectedRdv.heureFin.heure
                          : selectedHeureFin.heure
                      }
                      onChange={(e) => {
                        setSelectedHeureFin({
                          ...selectedHeureFin,
                          heure: e.target.value,
                        });
                      }}
                      type="number"
                      width={80}
                      label="Heure"
                      height={35}
                      max={23}
                    />
                  </div>
                  <div className="ml-2">
                    <Input
                      name="minute"
                      value={
                        selectedRdv && selectedRdv.heureFin
                          ? selectedRdv.heureFin.minute
                          : selectedHeureFin.minute
                      }
                      onChange={(e) => {
                        setSelectedHeureFin({
                          ...selectedHeureFin,
                          minute: e.target.value,
                        });
                      }}
                      label="Min"
                      type="number"
                      width={80}
                      height={35}
                      max={59}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            className="m-2 mt-3 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
            onClick={async () => {
              if (isRdvModified) {
                let oldData = {
                  _id: selectedRdv._id,
                  patientId: selectedPatient._id,
                  datePrevu: selectedRdv.datePrevu,
                  isReporte: true,
                  dateNouveauRdv: selectedRdvDate,
                };
                let newData = {
                  patientId: selectedPatient._id,
                  datePrevu: selectedRdvDate,
                  heureDebut: selectedHeureDebut,
                  heureFin: selectedHeureFin,
                };
                await saveRdv(oldData);
                await saveRdv(newData);
              } else {
                await saveRdv({
                  patientId: selectedPatient._id,
                  datePrevu: selectedRdvDate,
                  heureDebut: selectedHeureDebut,
                  heureFin: selectedHeureFin,
                });
              }
              history.push("/rdvs");
            }}
          >
            save
          </button>
        </>
      )}
    </div>
  );
}

export default RdvForm;
