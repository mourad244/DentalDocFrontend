import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { getRdvs, saveRdv, deleteRdv } from "../../services/rdvServices";

// import _ from "lodash";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";

const AgendaRdv = (props) => {
  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre",
  ];
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  const {
    selectedRdv,
    selectedDuree,
    selectedMoments,
    selectedPatient,
    selectedRdvDate,
  } = props;

  const [rdvs, setRdvs] = useState([]);
  const [filteredRdvsPatient, setFilteredRdvsPatient] = useState([]);
  const [filteredRdvs, setFilteredRdvs] = useState([]);
  const [hourlySegments, setHourlySegments] = useState({});
  const date = new Date();
  const [time, setTime] = useState(new Date());
  const [nombreDays, setNombreDays] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: rdvs } = await getRdvs();
      setRdvs(rdvs);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterRdvs = async () => {
      let listRdvObj = {};
      let newfilteredRdvsPatient = [];
      let newPatientRdvs = [];
      let filteredRdvs = rdvs
        .filter((e) => {
          return (
            new Date(e.datePrevu).getFullYear() === time.getFullYear() &&
            new Date(e.datePrevu).getMonth() === time.getMonth()
          );
        })
        .map((e) => {
          let date = `${new Date(e.datePrevu).getMonth() + 1}-${new Date(
            e.datePrevu,
          ).getDate()}-${new Date(e.datePrevu).getFullYear()}`;
          if (e.patientId._id === selectedPatient._id) {
            newfilteredRdvsPatient.push(e);
          }
          if (e.patientId._id) {
            newPatientRdvs.push(date);
          }
          if (!listRdvObj[date]) listRdvObj[date] = 1;
          else listRdvObj[date] += 1;
          return e;
        });
      setFilteredRdvs(filteredRdvs);
      setFilteredRdvsPatient(newfilteredRdvsPatient);
    };
    filterRdvs();
  }, [rdvs, selectedPatient, time]);

  useEffect(() => {
    const daysInMonth = () => {
      const newNombreDays = new Date(
        time.getFullYear(),
        time.getMonth() + 1,
        0,
      ).getDate();
      setNombreDays(newNombreDays);
    };
    daysInMonth();
  }, [time]);
  useEffect(() => {
    const segments = createHourlySegments(filteredRdvs);
    setHourlySegments(segments);
    const availableTimes = calculateAvailableTimes(segments);
    props.onAvailableTimesChange(availableTimes);
  }, [filteredRdvs, selectedRdvDate]);
  const navigateDate = (operation) => {
    const periode = new Date(time.setMonth(time.getMonth() + operation));
    setTime(periode);
  };
  const displayDate = () => {
    return mois[time.getMonth()] + " - " + time.getFullYear();
  };
  const handleSelectedDate = async (index) => {
    const date = new Date(time.getFullYear(), time.getMonth(), index + 1);
    let deletedDate = filteredRdvsPatient.find(
      (e) =>
        new Date(e.datePrevu).getFullYear() === date.getFullYear() &&
        new Date(e.datePrevu).getMonth() === date.getMonth() &&
        new Date(e.datePrevu).getDate() === date.getDate(),
    );
    if (deletedDate && window.confirm("Confirmer le suppression du rdv")) {
      props.onDeleteRdv(deletedDate._id);
    } else {
      props.onSelectDate(date);
    }
  };
  const displayDates = () => {
    let countTotal = 0;
    let totalDiv = [];
    do {
      let arrayDiv = [];
      for (let j = 0; j < days.length; j++) {
        const t = countTotal;
        let d = new Date(time.getFullYear(), time.getMonth(), t + 1);
        if (
          days[j] === days[d.getDay()] &&
          t < nombreDays &&
          d.getDay() !== 0
        ) {
          let found = filteredRdvsPatient.find((e) => {
            return new Date(e.datePrevu).getDate() === d.getDate();
          });
          if (
            selectedRdvDate &&
            selectedRdvDate.getDate() === d.getDate() &&
            selectedRdvDate.getMonth() === d.getMonth() &&
            selectedRdvDate.getFullYear() === d.getFullYear()
          ) {
            arrayDiv.push(
              <div
                key={"date-active" + countTotal}
                className={`m-2 flex h-10 w-10 rounded-3xl bg-[#152961] text-white shadow-daySelected`}
                // onClick={() => handleSelectedDate(t)}
              >
                <label className="m-auto align-middle text-sm font-bold">
                  {countTotal + 1}
                </label>
              </div>,
            );
          } else if (found) {
            if (
              d.getFullYear() > date.getFullYear() ||
              (d.getFullYear() >= date.getFullYear() &&
                d.getMonth() > date.getMonth()) ||
              (d.getFullYear() >= date.getFullYear() &&
                d.getMonth() >= date.getMonth() &&
                d.getDate() >= date.getDate())
            ) {
              arrayDiv.push(
                <div
                  key={"date-active" + countTotal}
                  className={`m-2 flex h-10 w-10 rounded-3xl  ${
                    found.isReporte
                      ? "bg-[#e49012]"
                      : found.isAnnule
                      ? " bg-[#ff6868]"
                      : "bg-[#506496]"
                  }  text-white shadow-daySelected`}
                  // onClick={() => handleSelectedDate(t)}
                >
                  <label className="m-auto align-middle text-sm font-bold">
                    {countTotal + 1}
                  </label>
                </div>,
              );
            } else {
              arrayDiv.push(
                <div
                  key={"date-active" + countTotal}
                  className=" m-2 flex h-10 w-10 rounded-3xl bg-[#d6d7ed]"
                  // onClick={() => handleSelectedDate(t)}
                >
                  <label className="m-auto cursor-auto align-middle text-sm font-bold">
                    {countTotal + 1}
                  </label>
                </div>,
              );
            }
          } else if (!found || found.nombre < 10) {
            if (
              d.getFullYear() > date.getFullYear() ||
              (d.getFullYear() >= date.getFullYear() &&
                d.getMonth() > date.getMonth()) ||
              (d.getFullYear() >= date.getFullYear() &&
                d.getMonth() >= date.getMonth() &&
                d.getDate() >= date.getDate())
            )
              arrayDiv.push(
                <div
                  key={"date-active" + countTotal}
                  className="m-2 flex h-10 w-10 cursor-pointer rounded-3xl bg-[#caecff]"
                  onClick={() => handleSelectedDate(t)}
                >
                  <label className="m-auto cursor-pointer align-middle text-sm font-bold">
                    {countTotal + 1}
                  </label>
                </div>,
              );
            else
              arrayDiv.push(
                <div
                  key={"date-active" + countTotal}
                  className=" m-2 flex h-10 w-10 rounded-3xl bg-[#f0faff]"
                  // onClick={() => handleSelectedDate(t)}
                >
                  <label className="m-auto cursor-auto align-middle text-sm font-bold">
                    {countTotal + 1}
                  </label>
                </div>,
              );
          } else if (found.nombre >= 10) {
            arrayDiv.push(
              <div
                key={"date-active" + countTotal}
                className="pointer-events-none m-2  flex h-10 w-10 rounded-3xl bg-[#eaeaea] shadow-dayFull"
                onClick={() => handleSelectedDate(t)}
              >
                <label className="m-auto cursor-pointer align-middle text-sm font-bold">
                  {countTotal + 1}
                </label>
              </div>,
            );
          }
          countTotal++;
        } else if (d.getDay() === 0) {
          arrayDiv.push(
            <div
              key={"date-inactif" + j}
              className=" m-2  flex h-10 w-10 rounded-3xl bg-white"
            />,
          );
          countTotal++;
        } else {
          arrayDiv.push(
            <div
              key={"date-inactif" + j}
              className=" m-2  flex h-10 w-10 rounded-3xl bg-white"
            />,
          );
        }
      }
      totalDiv.push(arrayDiv);
    } while (countTotal < nombreDays);
    return totalDiv;
  };
  const createHourlySegments = (filteredRdvs) => {
    const workHoursStart = 9;
    const workHoursEnd = 19;
    let hourlySegments = {};

    // Step 1: Initialize the segments for each hour
    for (let hour = workHoursStart; hour < workHoursEnd; hour++) {
      hourlySegments[hour] = Array.from({ length: 60 }, (_, index) => ({
        minute: index,
        available: true,
      }));
    }
    if (!selectedRdvDate) filteredRdvs = [];
    // Step 2: Mark the minutes covered by RDVs as not available
    else
      filteredRdvs
        .filter((e) => {
          return (
            new Date(e.datePrevu).getDate() === selectedRdvDate.getDate() &&
            new Date(e.datePrevu).getMonth() === selectedRdvDate.getMonth() &&
            new Date(e.datePrevu).getFullYear() ===
              selectedRdvDate.getFullYear()
          );
        })
        .forEach((rdv) => {
          const startHour = rdv.heureDebut.heure;
          const endHour = rdv.heureFin.heure;
          let currentHour = startHour;
          let currentMinute = rdv.heureDebut.minute;

          while (
            currentHour < endHour ||
            (currentHour === endHour && currentMinute < rdv.heureFin.minute)
          ) {
            if (hourlySegments[currentHour]) {
              hourlySegments[currentHour][currentMinute].available = false;
            }

            // Increment minutes and handle the overflow by moving to the next hour
            currentMinute++;
            if (currentMinute === 60) {
              currentMinute = 0;
              currentHour++;
            }
          }
        });
    // Step 3: Merge contiguous minutes into segments
    let mergedSegments = {};
    Object.keys(hourlySegments).forEach((hour) => {
      mergedSegments[hour] = [];
      let segmentStart = null;
      let lastState = null;

      hourlySegments[hour].forEach((minuteSlot, index) => {
        if (lastState !== minuteSlot.available) {
          if (lastState !== null) {
            mergedSegments[hour].push({
              start: segmentStart,
              end: index,
              available: lastState,
            });
          }
          segmentStart = index;
          lastState = minuteSlot.available;
        }
        if (index === 59) {
          mergedSegments[hour].push({
            start: segmentStart,
            end: 60,
            available: minuteSlot.available,
          });
        }
      });
    });
    return mergedSegments;
  };
  const calculateAvailableTimes = (hourlySegments) => {
    let availableTimes = [];
    Object.keys(hourlySegments).forEach((hour) => {
      let startMinute = null;
      hourlySegments[hour].forEach((segment, index) => {
        if (segment.available) {
          if (startMinute === null) {
            startMinute = segment.start; // Begin a new available slot
          }
          // Check if this is the last minute in the hour or the next segment is not available
          if (
            index === hourlySegments[hour].length - 1 ||
            !hourlySegments[hour][index + 1]?.available
          ) {
            let endMinute = segment.end;
            // Adjust for crossing into the next hour
            let endHour = hour;
            if (endMinute === 60) {
              endHour = (parseInt(hour) + 1).toString();
              endMinute = 0;
            }
            availableTimes.push({
              startHour: parseInt(hour),
              startMinute: startMinute,
              endHour: parseInt(endHour),
              endMinute: endMinute,
            });
            startMinute = null; // Reset for the next available slot
          }
        }
      });
    });
    return availableTimes;
  };
  const MorningSessions = ({ hourlySegments }) => {
    // Filter and render only the morning segments
    const morningHours = Object.keys(hourlySegments).filter(
      (hour) => hour >= 9 && hour < 12,
    );
    return (
      <div className="m-2">
        <p className=" text-sm font-bold text-slate-800">Matinée</p>
        {renderHourlySegments(hourlySegments, morningHours)}
      </div>
    );
  };
  const AfternoonSessions = ({ hourlySegments }) => {
    // Filter and render only the afternoon segments
    const afternoonHours = Object.keys(hourlySegments).filter(
      (hour) => hour >= 12 && hour < 16,
    );
    return (
      <div className="m-2">
        <p className="text-sm font-bold text-slate-800">Après midi</p>
        {renderHourlySegments(hourlySegments, afternoonHours)}
      </div>
    );
  };
  const EveningSessions = ({ hourlySegments }) => {
    // Filter and render only the evening segments
    const eveningHours = Object.keys(hourlySegments).filter(
      (hour) => hour >= 16 && hour < 19,
    );
    return (
      <div className="m-2">
        <p className="text-sm font-bold text-slate-800">Soirée</p>
        {renderHourlySegments(hourlySegments, eveningHours)}
      </div>
    );
  };
  const renderHourlySegments = (hourlySegments, hours) => {
    return hours.map((hour) => {
      const segments = hourlySegments[hour];
      return (
        <div
          key={hour}
          style={{ display: "flex", alignItems: "center", margin: "5px 0" }}
        >
          {segments.map((segment, index) => {
            const startTime = formatSegmentTime(parseInt(hour), segment.start);
            const endTime = formatSegmentTime(parseInt(hour), segment.end);
            const durationInMinutes = segment.end - segment.start;
            const segmentWidth = `${((durationInMinutes / 60) * 100).toFixed(
              2,
            )}%`;

            return (
              <div
                key={index}
                className={` p-2 text-center text-xs font-bold text-zinc-700 ${
                  segment.available ? "bg-green-500" : "bg-gray-300"
                }`}
                style={{
                  width: segmentWidth,
                }}
              >
                {startTime} - {endTime}
              </div>
            );
          })}
        </div>
      );
    });
  };
  const formatSegmentTime = (hour, minute) => {
    // If the minute is 60, we roll over to the next hour
    if (minute === 60) {
      hour += 1;
      minute = 0;
    }
    // Ensure we don't go over 24 hours and reset to 0 if we do
    hour = hour % 24;
    // Format time. If minutes are '00', display only the hour with 'h'
    return minute === 0
      ? `${hour}h`
      : `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
  };
  return (
    <div className="flex flex-wrap">
      <div className="m-auto my-2 flex h-fit w-fit min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <div className=" m-auto my-2 flex items-center rounded-md bg-[#f5f5f5] p-2 shadow-md">
          <PrecedentButton
            className="cursor-pointer"
            onClick={() => {
              navigateDate(-1);
            }}
          />
          <p className="text-md m-auto mx-3 font-bold leading-5">
            {displayDate()}
          </p>
          <SuivantButton
            onClick={() => {
              navigateDate(1);
            }}
            className="cursor-pointer"
          />
        </div>
        <div className="mb-3 ml-14 mt-6 flex">
          {days.map((e) =>
            e !== "Dimanche" ? (
              <label
                className="w-14 text-center text-xs font-bold text-[#3d3d3d]"
                key={e}
                htmlFor={e}
              >
                {e}
              </label>
            ) : (
              ""
            ),
          )}
        </div>
        <div className="flex w-[420px] flex-wrap">{displayDates()}</div>
      </div>
      {selectedRdvDate && (
        <div className="m-auto my-2 flex h-fit w-96 flex-col rounded-5px border border-white bg-white shadow-component ">
          <MorningSessions hourlySegments={hourlySegments} />
          <AfternoonSessions hourlySegments={hourlySegments} />
          <EveningSessions hourlySegments={hourlySegments} />
        </div>
      )}
    </div>
  );
};

export default withRouter(AgendaRdv);
