import React, { useState, useEffect } from "react";

import { getRdv, deleteRdv, saveRdv } from "../../services/rdvServices";
import { getPatients } from "../../services/patientService";

import { useHistory } from "react-router-dom";

import AgendaRdv from "./agendaRdv";

import SearchBox from "../../common/searchBox";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { getNatureActes } from "../../services/natureActeService";
import {
  getActeDentaires,
  saveActeDentaire,
} from "../../services/acteDentaireService";
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
    heure: "00",
    minute: "00",
  });
  const [selectedHeureFin, setSelectedHeureFin] = useState({
    heure: "00",
    minute: "00",
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [startTimeOptions, setStartTimeOptions] = useState([]);
  const [filteredActes, setFilteredActes] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedRdvDate, setSelectedRdvDate] = useState("");
  const isRdvModified = props.match.params.id !== "new";
  const isPostponed = props.match.path === "/rdvs/postpone/:id";
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const { data: actesData } = await getActeDentaires();
      const { data: natureActesData } = await getNatureActes();
      if (props.match.params.id !== "new") {
        const { data: rdvData } = await getRdv(props.match.params.id);
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

  useEffect(() => {
    // Generate the start time options based on the available times and selected duration
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

    // Create copies of the arrays to avoid modifying the original arrays
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
  // Function to filter available start times based on selected duration

  // Example of handling start time selection
  const handleStartTimeChange = (hour, minute) => {
    setSelectedHeureDebut({
      heure: hour,
      minute: minute,
    });
    // Additional logic to set end time based on start time and duration
    calculateEndTime(hour, minute);
  };

  const generateTimeOptions = (availableTimes, selectedDuree) => {
    let options = [];
    const durationInMinutes = parseInt(selectedDuree);
    // Function to check if a time range is available
    const isRangeAvailable = (
      startHour,
      startMinute,
      duration,
      availableTimes,
    ) => {
      const startTime = startHour * 60 + startMinute;
      const endTime = startTime + duration;

      // Check if start time is within any slot
      const startSlotIndex = availableTimes.findIndex((slot) => {
        const slotStart = slot.startHour * 60 + slot.startMinute;
        const slotEnd = slot.endHour * 60 + slot.endMinute;
        return startTime >= slotStart && startTime < slotEnd;
      });

      // If start time is not within any slot, it's not available
      if (startSlotIndex === -1) return false;

      // Check if the end time is within the same slot or extends to the next slot
      const startSlot = availableTimes[startSlotIndex];
      const startSlotEnd = startSlot.endHour * 60 + startSlot.endMinute;

      // If the end time is within the same slot, it's available
      if (endTime <= startSlotEnd) return true;

      // If the end time extends to the next slot, check if the next slot is available
      if (startSlotIndex + 1 < availableTimes.length) {
        const nextSlot = availableTimes[startSlotIndex + 1];
        const nextSlotStart = nextSlot.startHour * 60 + nextSlot.startMinute;
        const nextSlotEnd = nextSlot.endHour * 60 + nextSlot.endMinute;

        // Check if the next slot directly follows the current slot and accommodates the end time
        return nextSlotStart === startSlotEnd && endTime <= nextSlotEnd;
      }

      // If there is no next slot or the end time does not fit within it, it's not available
      return false;
    };
    availableTimes.forEach((timeSlot, i) => {
      let currentHour = timeSlot.startHour;
      let currentMinute = timeSlot.startMinute;
      // Ensure the first option starts at a quarter-hour if not already
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

        // Increment by 15 minutes
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
              <div className="mt-3">
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
            <div>
              <div className=" flex flex-col">
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
                    className=" rounded-md	border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                    name="heuredebut"
                    onChange={(e) => {
                      const [hour, minute] = e.target.value.split("-");
                      handleStartTimeChange(hour, minute);
                    }}
                    style={{ height: 35 }}
                    value={
                      selectedHeureDebut && selectedHeureDebut.heure
                        ? selectedHeureDebut.heure.toString().padStart(2, "0") +
                          "-" +
                          selectedHeureDebut.minute.toString().padStart(2, "0")
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
          <button
            disabled={
              !selectedDuree ||
              selectedDuree <= 0 ||
              !selectedRdvDate ||
              !selectedHeureDebut.heure ||
              !selectedHeureDebut.minute
            }
            className={`m-2 ml-auto mt-3 flex w-fit cursor-pointer list-none rounded-lg p-3 text-center text-xs font-bold text-white no-underline ${
              selectedDuree <= 0 ||
              !selectedDuree ||
              !selectedRdvDate ||
              !selectedHeureDebut.heure
                ? "cursor-default bg-gray-400"
                : "bg-[#455a94]"
            } `}
            onClick={async () => {
              if (isRdvModified) {
                if (isPostponed) {
                  let oldData = {
                    _id: selectedRdv._id,
                    patientId: selectedPatient._id,
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
                // save duree to acteDentaire if it have not an save moments to acteDentaire it is different from acte
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
      )}
    </div>
  );
}

export default RdvForm;
