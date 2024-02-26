import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  getActeDentaires,
  saveActeDentaire,
} from "../../services/acteDentaireService";
import { getPatient } from "../../services/patientService";
import { getNatureActes } from "../../services/natureActeService";
import { getRdv, deleteRdv, saveRdv } from "../../services/rdvService";

import AgendaRdv from "./agendaRdv";
import PatientForm from "../patients/patientForm";
import SearchPatient from "../../common/searchPatient";

import Input from "../../common/input";
import Select from "../../common/select";
import Checkbox from "../../common/checkbox";
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";

function RdvForm(props) {
  const [actes, setActes] = useState([]);
  const [natureActes, setNatureActes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState({});
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [selectedNatureActe, setSelectedNatureActe] = useState({});
  const [selectedActe, setSelectedActe] = useState({});
  const [selectedDuree, setSelectedDuree] = useState(0);
  const [selectedMomemts, setSelectedMoments] = useState([]);
  const [selectedHeureDebut, setSelectedHeureDebut] = useState({
    heure: "00",
    minute: "00",
  });
  const [selectedHeureFin, setSelectedHeureFin] = useState({
    heure: "00",
    minute: "00",
  });
  const [filteredActes, setFilteredActes] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedRdvDate, setSelectedRdvDate] = useState("");
  const [startTimeOptions, setStartTimeOptions] = useState([]);
  const [patienDataIsValid, setPatientDataIsValid] = useState(false);

  const history = useHistory();
  const rdvId = props.match.params.id;
  const isRdvModified = rdvId !== "new";
  const isPostponed = props.match.path === "/rdvs/postpone/:id";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: actesData } = await getActeDentaires();
      const { data: natureActesData } = await getNatureActes();
      if (rdvId !== "new") {
        const { data: rdvData } = await getRdv(rdvId);
        let newSelectedActe = rdvData.acteId
          ? actesData.find((a) => a._id === rdvData.acteId)
          : {};
        setActes(actesData);
        setSelectedRdv(rdvData);
        setNatureActes(natureActesData);
        setSelectedPatient(rdvData.patientId);
        setSelectedNatureActe(
          rdvData.natureId
            ? natureActesData.find((n) => n._id === rdvData.natureId)
            : {},
        );
        setSelectedActe(newSelectedActe);
        setSelectedDuree(
          rdvData.heureFin.heure * 60 +
            rdvData.heureFin.minute -
            (rdvData.heureDebut.heure * 60 + rdvData.heureDebut.minute),
        );
        setSelectedMoments(
          newSelectedActe && newSelectedActe.moments
            ? newSelectedActe.moments
            : [],
        );
        setSelectedRdvDate(new Date(rdvData.datePrevu));

        setSelectedHeureDebut({
          heure: rdvData.heureDebut.heure
            ? rdvData.heureDebut.heure.toString().padStart(2, "0")
            : "00",
          minute: rdvData.heureDebut.minute
            ? rdvData.heureDebut.minute.toString().padStart(2, "0")
            : "00",
        });
        setSelectedHeureFin({
          heure: rdvData.heureFin.heure
            ? rdvData.heureFin.heure.toString().padStart(2, "0")
            : "00",
          minute: rdvData.heureFin.minute
            ? rdvData.heureFin.minute.toString().padStart(2, "0")
            : "00",
        });
      } else {
        setActes(actesData);
        setNatureActes(natureActesData);
      }
      setLoading(false);
    };
    fetchData();
  }, [rdvId]);

  useEffect(() => {
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
  }, [selectedNatureActe, actes]);

  useEffect(() => {
    const options = generateTimeOptions(availableTimes, selectedDuree);
    setStartTimeOptions(options);
  }, [availableTimes, selectedDuree]);

  const onDateSelect = async (date) => {
    setSelectedRdvDate(date);
  };

  const onRdvDelete = async (rdvId) => {
    await deleteRdv(rdvId);
    history.push("/rdvs");
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) return false;
    }
    return true;
  };

  const calculateEndTime = (startHour, startMinute) => {
    // Convert parameters to integers to ensure proper calculations
    startHour = parseInt(startHour, 10);
    startMinute = parseInt(startMinute, 10);
    const duration = parseInt(selectedDuree, 10);
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

  const handleStartTimeChange = (hour, minute) => {
    setSelectedHeureDebut({
      heure: hour,
      minute: minute,
    });
    calculateEndTime(hour, minute);
  };

  const generateTimeOptions = (availableTimes, selectedDuree) => {
    let options = [];
    const durationInMinutes = parseInt(selectedDuree);
    const isRangeAvailable = (
      startHour,
      startMinute,
      duration,
      availableTimes,
    ) => {
      const startTime = startHour * 60 + startMinute;
      const endTime = startTime + duration;
      const startSlotIndex = availableTimes.findIndex((slot) => {
        const slotStart = slot.startHour * 60 + slot.startMinute;
        const slotEnd = slot.endHour * 60 + slot.endMinute;
        return startTime >= slotStart && startTime < slotEnd;
      });
      if (startSlotIndex === -1) return false;
      const startSlot = availableTimes[startSlotIndex];
      const startSlotEnd = startSlot.endHour * 60 + startSlot.endMinute;
      if (endTime <= startSlotEnd) return true;
      if (startSlotIndex + 1 < availableTimes.length) {
        const nextSlot = availableTimes[startSlotIndex + 1];
        const nextSlotStart = nextSlot.startHour * 60 + nextSlot.startMinute;
        const nextSlotEnd = nextSlot.endHour * 60 + nextSlot.endMinute;
        return nextSlotStart === startSlotEnd && endTime <= nextSlotEnd;
      }
      return false;
    };

    availableTimes.forEach((timeSlot, i) => {
      let currentHour = timeSlot.startHour;
      let currentMinute = timeSlot.startMinute;
      if (currentMinute % 15 !== 0) {
        currentMinute += 15 - (currentMinute % 15);
      }
      while (
        currentHour < timeSlot.endHour ||
        (currentHour === timeSlot.endHour && currentMinute < timeSlot.endMinute)
      ) {
        if (
          isRangeAvailable(
            currentHour,
            currentMinute,
            durationInMinutes,
            availableTimes,
            i,
          )
        ) {
          let hour = currentHour.toString().padStart(2, "0");
          let minute = currentMinute.toString().padStart(2, "0");
          options.push({
            label: `${hour}:${minute}`,
            value: `${hour}-${minute}`,
          });
        }
        currentMinute += 15;
        if (currentMinute >= 60) {
          currentMinute -= 60;
          currentHour += 1;
        }
      }
    });

    return options;
  };
  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
      <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
        Nouveau Rendez-vous
      </p>
      <div className="ml-2  flex justify-start">
        <button
          className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
          onClick={() => {
            history.push("/rdvs");
          }}
        >
          <IoChevronBackCircleSharp className="mr-1 " />
          Retour à la Liste
        </button>
      </div>
      {rdvId === "new" && !selectedPatient._id && (
        <SearchPatient
          onPatientSelect={async (patient) => {
            setLoadingPatient(true);
            const { data: newPatient } = await getPatient(patient._id);
            setSelectedPatient(newPatient);
            setLoadingPatient(false);
          }}
        />
      )}
      <div className="m-2 flex flex-col  bg-[#adced8] ">
        {selectedPatient &&
        Object.keys(selectedPatient).length !== 0 &&
        selectedPatient._id ? (
          <div className=" flex w-full flex-row rounded-sm bg-[#4F6874]  p-2">
            <div className="m-auto w-auto">
              <p className="text-center text-base font-bold text-white">{`${
                selectedPatient.nom && selectedPatient.nom.toUpperCase()
              } ${
                selectedPatient.prenom && selectedPatient.prenom.toUpperCase()
              }`}</p>
            </div>
            {rdvId === "new" && (
              <button
                className=" h-6 w-6 rounded-md bg-red-400 p-1 font-bold leading-4 text-white"
                onClick={() => {
                  setSelectedPatient({});
                  setPatientDataIsValid(false);
                }}
              >
                x
              </button>
            )}
          </div>
        ) : (
          loadingPatient && (
            <div className="m-auto my-4">
              <ClipLoader loading={loadingPatient} size={50} />
            </div>
          )
        )}
        {!loadingPatient ? (
          <div className=" w-[95%]">
            <PatientForm
              selectedPatient={selectedPatient}
              onPatientChange={(patient) => {
                setSelectedPatient(patient);
              }}
              dataIsValid={(isValid) => setPatientDataIsValid(isValid)}
              isRdvForm={true}
            />
          </div>
        ) : (
          <div className="m-auto my-4">
            <ClipLoader loading={loadingPatient} size={50} />
          </div>
        )}
      </div>
      {!loadingPatient &&
      !loading &&
      selectedPatient &&
      Object.keys(selectedPatient).length !== 0 &&
      patienDataIsValid ? (
        <>
          <div className="m-2 flex flex-wrap  rounded-sm bg-[#adced8] pb-2  pt-2 shadow-md ">
            <div className="mt-3 w-max">
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
              <div className="mt-3 w-max">
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
              <div className="mt-3 w-max">
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
                    setSelectedHeureDebut({ heure: 0, minute: 0 });
                    setSelectedHeureFin({ heure: 0, minute: 0 });
                  }}
                  type="number"
                  widthLabel={96}
                  width={80}
                />
              </div>
            )}
            {selectedActe && (
              <div className="mt-3 w-max">
                <Checkbox
                  name={"moments"}
                  label={"Moments"}
                  widthLabel={96}
                  width={200}
                  listItems={["matin", "apres-midi", "soir"]}
                  labelItems={["Matin", "Après-midi", "Soir"]}
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
          <div className=" flex flex-col">
            {selectedDuree > 0 && (
              <AgendaRdv
                selectedRdv={selectedRdv}
                onDeleteRdv={onRdvDelete}
                onSelectDate={onDateSelect}
                selectedDuree={selectedDuree}
                selectedPatient={selectedPatient}
                selectedRdvDate={selectedRdvDate}
                selectedMoments={selectedMomemts}
                onAvailableTimesChange={setAvailableTimes}
              />
            )}
            {selectedRdvDate && selectedDuree > 0 && (
              <div className="m-2 flex h-fit  flex-wrap rounded-sm bg-[#adced8] pb-2 pt-2 shadow-md ">
                <div className=" mx-2 flex min-w-max flex-col">
                  <div className="flex w-fit flex-wrap">
                    <label
                      style={{
                        width: 96,
                      }}
                      className="mr-3 text-right text-xs font-bold leading-9 text-[#72757c]"
                    >
                      Début
                    </label>
                    <select
                      className=" rounded-md	border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                      name="heuredebut"
                      onChange={(e) => {
                        const [hour, minute] = e.target.value.split("-");
                        handleStartTimeChange(hour, minute);
                      }}
                      style={{ height: 35 }}
                      value={
                        selectedHeureDebut && selectedHeureDebut.heure
                          ? selectedHeureDebut.heure
                              .toString()
                              .padStart(2, "0") +
                            "-" +
                            selectedHeureDebut.minute
                              .toString()
                              .padStart(2, "0")
                          : ""
                      }
                    >
                      <option value="" />
                      {startTimeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            disabled={
              !selectedDuree ||
              !selectedRdvDate ||
              !patienDataIsValid ||
              selectedDuree <= 0 ||
              !selectedHeureDebut.heure ||
              selectedHeureDebut.heure === "00"
            }
            className={`m-2 ml-auto mt-3 flex w-fit cursor-pointer list-none rounded-lg p-3 text-center text-xs font-bold text-white no-underline ${
              !selectedDuree ||
              !selectedRdvDate ||
              !patienDataIsValid ||
              selectedDuree <= 0 ||
              !selectedHeureDebut.heure ||
              selectedHeureDebut.heure === "00"
                ? "cursor-default bg-gray-400"
                : "bg-[#4F6874]"
            } `}
            onClick={async () => {
              if (isRdvModified) {
                if (isPostponed) {
                  let oldData = {
                    _id: selectedRdv._id,
                    patientId: selectedPatient._id,
                    newPatient: selectedPatient,
                    datePrevu: selectedRdv.datePrevu,
                    natureId: selectedNatureActe
                      ? selectedNatureActe._id
                      : null,
                    acteId: selectedActe ? selectedActe._id : null,
                    isReporte: true,
                    dateNouveauRdv: selectedRdvDate,
                  };
                  let newData = {
                    patientId: selectedPatient._id,
                    newPatient: selectedPatient,
                    datePrevu: selectedRdvDate,

                    lastRdvId: selectedRdv._id,
                    natureId: selectedNatureActe
                      ? selectedNatureActe._id
                      : null,
                    acteId: selectedActe ? selectedActe._id : null,
                    heureDebut: selectedHeureDebut,
                    heureFin: selectedHeureFin,
                  };
                  await saveRdv(oldData);
                  await saveRdv(newData);
                } else {
                  await saveRdv({
                    _id: selectedRdv._id,
                    patientId: selectedPatient._id,
                    newPatient: selectedPatient,
                    datePrevu: selectedRdvDate,
                    natureId: selectedNatureActe
                      ? selectedNatureActe._id
                      : null,

                    acteId: selectedActe ? selectedActe._id : null,
                    heureDebut: selectedHeureDebut,
                    heureFin: selectedHeureFin,
                    lastRdvId: selectedRdv.lastRdvId,
                  });
                }
              } else {
                if (selectedActe && selectedActe._id) {
                  let acteDentaire = { ...selectedActe };
                  acteDentaire.natureId = acteDentaire.natureId._id;
                  if (!acteDentaire.duree) {
                    acteDentaire.duree = selectedDuree;
                    !arraysEqual(acteDentaire.moments, selectedMomemts) &&
                      (acteDentaire.moments = selectedMomemts);
                    await saveActeDentaire(acteDentaire);
                  } else {
                    !arraysEqual(acteDentaire.moments, selectedMomemts) &&
                      (acteDentaire.moments = selectedMomemts);
                    await saveActeDentaire(acteDentaire);
                  }
                }
                await saveRdv({
                  patientId: selectedPatient._id,
                  datePrevu: selectedRdvDate,
                  newPatient: selectedPatient,
                  natureId: selectedNatureActe ? selectedNatureActe._id : null,
                  acteId: selectedActe ? selectedActe._id : null,
                  heureDebut: selectedHeureDebut,
                  heureFin: selectedHeureFin,
                });
              }
              history.push("/rdvs");
            }}
          >
            Sauvegarder
          </button>
        </>
      ) : (
        <div className="m-auto my-4">
          <ClipLoader loading={loading} size={70} />
        </div>
      )}
    </div>
  );
}

export default RdvForm;
