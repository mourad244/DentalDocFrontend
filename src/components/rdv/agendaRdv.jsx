import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { getRdvs } from "../../services/rdvService";

// import _ from "lodash";
import PrecedentButton from "../../assets/icons/precedent-btn.svg";
import SuivantButton from "../../assets/icons/suivant-btn.svg";
const createHourlySegments = (filteredRdvs, selectedRdv, selectedRdvDate) => {
  const workHoursStart = 9;
  const workHoursEnd = 19;
  let mergedSegments = {};
  // make all segments available
  for (let i = workHoursStart; i < workHoursEnd; i++) {
    mergedSegments[i] = [
      { start: 0, end: 60, available: true, isSelected: false },
    ];
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
            selectedRdvDate.getFullYear() &&
          !e.isAnnule &&
          !e.isReporte
        );
      })
      .forEach((rdv) => {
        const startHour = rdv.heureDebut.heure;
        const startMinute = rdv.heureDebut.minute;

        const endHour = rdv.heureFin.heure;
        const endMinute = rdv.heureFin.minute;
        const isSelected = selectedRdv && selectedRdv._id === rdv._id;
        // Handle single-hour RDVs
        if (startHour === endHour) {
          // Find the segment that needs to be updated
          const segmentIndex = mergedSegments[startHour].findIndex(
            (segment) =>
              startMinute >= segment.start && endMinute <= segment.end,
          );

          if (segmentIndex !== -1) {
            const segment = mergedSegments[startHour][segmentIndex];
            // Check if RDV starts at the beginning of a segment
            if (segment.start === startMinute) {
              segment.available = false;
              segment.isSelected = isSelected;
              if (segment.end !== endMinute) {
                // Split the segment if RDV does not end at the end of a segment
                mergedSegments[startHour].splice(segmentIndex + 1, 0, {
                  start: endMinute,
                  end: segment.end,
                  available: true,
                  isSelected: false,
                });
                segment.end = endMinute;
              }
            } else {
              // Split the segment into two if RDV starts after the beginning of a segment
              mergedSegments[startHour].splice(segmentIndex, 0, {
                start: segment.start,
                end: startMinute,
                available: true,
                isSelected: false,
              });
              mergedSegments[startHour][segmentIndex + 1] = {
                start: startMinute,
                end: endMinute,
                available: false,
                isSelected: isSelected,
              };
              // Add a new segment for the remaining time if there's any
              if (segment.end !== endMinute) {
                mergedSegments[startHour].splice(segmentIndex + 2, 0, {
                  start: endMinute,
                  end: segment.end,
                  available: true,
                  isSelected: false,
                });
              }
            }
          }
        }
        // Handle multi-hour RDVs
        else {
          // Update segments for each hour covered by the RDV
          for (let hour = startHour; hour <= endHour; hour++) {
            // Find segments for the current hour
            const segmentStart = hour === startHour ? startMinute : 0;
            const segmentEnd = hour === endHour ? endMinute : 60;

            //  replace the whole hour segment with the rdv details
            mergedSegments[hour] = mergedSegments[hour]
              .map((segment) => {
                if (
                  segment.start === segmentStart &&
                  segment.end === segmentEnd
                ) {
                  // This segment is fully covered by the RDV
                  return {
                    ...segment,
                    available: false,
                    isSelected: isSelected,
                  };
                } else if (
                  segmentStart > segment.start &&
                  segmentStart < segment.end
                ) {
                  // The RDV starts in the middle of this segment
                  const newSegment = {
                    start: segmentStart,
                    end: segment.end,
                    available: false,
                    isSelected: isSelected,
                  };
                  // Adjust the original segment to end where the RDV starts
                  segment.end = segmentStart;
                  return [segment, newSegment];
                } else if (
                  segmentEnd > segment.start &&
                  segmentEnd < segment.end
                ) {
                  // The RDV ends in the middle of this segment
                  const newSegment = {
                    start: segment.start,
                    end: segmentEnd,
                    available: false,
                    isSelected: isSelected,
                  };
                  // Adjust the original segment to start where the RDV ends
                  segment.start = segmentEnd;
                  return [newSegment, segment];
                }

                return segment;
              })
              .flat();
          }
        }
      });
  return mergedSegments;
};
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
    selectedMoments,
    selectedPatient,
    selectedRdvDate,
    onAvailableTimesChange,
    onSelectDate,
    // selectedDuree,
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
    const segments = createHourlySegments(
      filteredRdvs,
      selectedRdv,
      selectedRdvDate,
    );
    setHourlySegments(segments);
    const availableTimes = calculateAvailableTimes(segments, selectedMoments);
    onAvailableTimesChange(availableTimes);
  }, [
    selectedRdv,
    filteredRdvs,
    selectedRdvDate,
    selectedMoments,
    onAvailableTimesChange,
  ]);
  const navigateDate = (operation) => {
    const periode = new Date(time.setMonth(time.getMonth() + operation));
    setTime(periode);
  };
  const displayDate = () => {
    return mois[time.getMonth()] + " - " + time.getFullYear();
  };
  const handleSelectedDate = async (index) => {
    const date = new Date(time.getFullYear(), time.getMonth(), index + 1);
    onSelectDate(date);
  };
  const displayDates = () => {
    let countTotal = 0;
    let totalDiv = [];
    do {
      let arrayDiv = [];
      for (let j = 0; j < days.length; j++) {
        const t = countTotal;
        let d = new Date(time.getFullYear(), time.getMonth(), t + 1);
        // if (t === 0) console.log("day", days[j]);
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
                className=" m-1 rounded-md bg-[#778e96] shadow-lg"
                key={"date-active" + countTotal}
              >
                <div
                  className={`m-2 flex h-10 w-10 rounded-3xl bg-[#caecff] shadow-inner`}
                >
                  <label className="m-auto align-middle text-sm font-bold">
                    {countTotal + 1}
                  </label>
                </div>
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
                  className=" m-1 rounded-md bg-[#D6E1E3] shadow-lg"
                  key={"date-active" + countTotal}
                >
                  <div
                    className={`m-2 flex h-10 w-10 cursor-pointer rounded-3xl shadow-inner ${
                      found.isReporte
                        ? "bg-[#e49012]"
                        : found.isAnnule
                          ? " bg-[#ff6868]"
                          : "bg-[#506496]"
                    }  text-white shadow-daySelected`}
                    onClick={() => handleSelectedDate(t)}
                  >
                    <label className="m-auto cursor-pointer align-middle text-sm font-bold">
                      {countTotal + 1}
                    </label>
                  </div>
                </div>,
              );
            } else {
              arrayDiv.push(
                <div
                  className=" m-1 rounded-md bg-[#D6E1E3] shadow-lg"
                  key={"date-active" + countTotal}
                >
                  <div className=" m-2 flex h-10 w-10 rounded-3xl bg-[#b1b2c4] shadow-inner">
                    <label className="m-auto cursor-auto align-middle text-sm font-bold">
                      {countTotal + 1}
                    </label>
                  </div>
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
                  className=" m-1 rounded-md bg-[#adced8] shadow-lg"
                  key={"date-active" + countTotal}
                >
                  <div
                    className="m-2 flex h-10 w-10 cursor-pointer rounded-3xl bg-[#caecff] shadow-md"
                    onClick={() => handleSelectedDate(t)}
                  >
                    <label className="m-auto cursor-pointer align-middle text-sm font-bold">
                      {countTotal + 1}
                    </label>
                  </div>
                </div>,
              );
            else
              arrayDiv.push(
                <div
                  className=" m-1 rounded-md bg-[#D6E1E3] shadow-md"
                  key={"date-active" + countTotal}
                >
                  <div className=" m-2 flex h-10 w-10 rounded-3xl bg-[#D6E1E3]">
                    <label className="m-auto cursor-auto align-middle text-sm font-bold">
                      {countTotal + 1}
                    </label>
                  </div>
                </div>,
              );
          } else if (found.nombre >= 10) {
            arrayDiv.push(
              <div key={"date-active" + countTotal} className=" m-1 bg-white">
                <div
                  className="pointer-events-none m-2  flex h-10 w-10 rounded-3xl bg-[#eaeaea] shadow-dayFull"
                  onClick={() => handleSelectedDate(t)}
                >
                  <label className="m-auto cursor-pointer align-middle text-sm font-bold">
                    {countTotal + 1}
                  </label>
                </div>
              </div>,
            );
          }
          countTotal++;
        } else if (j === 0 && countTotal === 0) {
          arrayDiv.push(
            <div className=" bg-white  p-1" key={"date-inactif" + j}>
              <div className=" m-2  flex h-10 w-10 rounded-3xl bg-white" />
            </div>,
          );
        } else if (d.getDay() === 0 || t >= nombreDays) {
          arrayDiv.push(
            <div className=" bg-white  p-1" key={"date-inactif" + j}>
              <div className=" m-2  flex h-10 w-10 rounded-3xl bg-white" />
            </div>,
          );
          countTotal++;
        } else {
          arrayDiv.push(
            <div className="p-1" key={"date-inactif" + j}>
              <div className=" m-2  flex h-10 w-10 rounded-3xl " />
            </div>,
          );
        }
      }
      totalDiv.push(arrayDiv);
    } while (countTotal < nombreDays);
    return totalDiv;
  };

  const calculateAvailableTimes = (hourlySegments, selectedMomemts) => {
    let availableTimes = [];
    Object.keys(hourlySegments)
      .filter((hour) => {
        if (selectedMomemts.includes("matin")) {
          if (hour >= 9 && hour < 12) {
            return hour;
          }
        }
        if (selectedMomemts.includes("apres-midi")) {
          if (hour >= 12 && hour < 16) {
            return hour;
          }
        }
        if (selectedMomemts.includes("soir")) {
          if (hour >= 16 && hour < 19) {
            return hour;
          }
        }
        return "";
      })
      .forEach((hour) => {
        let startMinute = null;
        hourlySegments[hour].forEach((segment, index) => {
          if (
            segment.available ||
            // case of selectedRdv
            segment.isSelected
          ) {
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
                className={`min-w-fit border-2 border-[#ffffff]  p-1  text-center text-xs font-bold   ${
                  segment.available
                    ? "bg-[#caecff] text-zinc-700 shadow-md"
                    : segment.isSelected
                      ? "bg-[#152961] text-white shadow-inner"
                      : "bg-gray-300 text-[#363636]"
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
      <div className="m-auto my-2  flex h-fit w-fit min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
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
          <img
            onClick={() => {
              navigateDate(1);
            }}
            src={SuivantButton}
            className="cursor-pointer"
          />
        </div>

        <div className="ml-16 mr-16 mt-2 flex bg-[#eeeeee] ">
          {days.map((e) =>
            e !== "Dimanche" ? (
              <label
                className="border-x-1 m-1 w-14 rounded-md border-white bg-[#6a8997] py-2 text-center text-xs font-bold  text-white"
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
        <div className=" flex w-[448px] flex-wrap bg-[#eeeeee]">
          {displayDates()}
        </div>
      </div>
      {selectedRdvDate && (
        <div className="m-auto my-2 flex h-fit w-[600px] flex-col rounded-5px border border-white bg-white shadow-component ">
          {selectedMoments.includes("matin") && (
            <MorningSessions hourlySegments={hourlySegments} />
          )}
          {selectedMoments.includes("apres-midi") && (
            <AfternoonSessions hourlySegments={hourlySegments} />
          )}
          {selectedMoments.includes("soir") && (
            <EveningSessions hourlySegments={hourlySegments} />
          )}
        </div>
      )}
    </div>
  );
};

export default withRouter(AgendaRdv);
