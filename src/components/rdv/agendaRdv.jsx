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

  return (
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
      {selectedRdvDate && (
        <div>
          {filteredRdvs
            .filter((e) => {
              return (
                new Date(e.datePrevu).getDate() === selectedRdvDate.getDate() &&
                new Date(e.datePrevu).getMonth() ===
                  selectedRdvDate.getMonth() &&
                new Date(e.datePrevu).getFullYear() ===
                  selectedRdvDate.getFullYear()
              );
            })
            .map((e) => {
              return (
                <div
                  id={e._id}
                  className="m-2 h-5  border-2 border-black text-center"
                >
                  {`${e.heureDebut.heure}h${e.heureDebut.minute} - ${e.heureFin.heure}h${e.heureFin.minute}`}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default withRouter(AgendaRdv);
