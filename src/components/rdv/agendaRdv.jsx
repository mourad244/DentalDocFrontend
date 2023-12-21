import React, { useState, useEffect } from "react";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";
// import _ from "lodash";
import { withRouter } from "react-router-dom";
import "./agendaRdv.css";
import { getRdvs, saveRdv, deleteRdv } from "../../services/rdvServices";

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
  const { selectedMedecin, selectedPatient } = props;
  const date = new Date();
  const [rdvs, setRdvs] = useState([]);
  const [filteredRdvs, setFilteredRdvs] = useState([]);
  const [nombreDays, setNombreDays] = useState("");
  const [reload, setReload] = useState(true);
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const fetchData = async () => {
      const { data: rdvs } = await getRdvs();
      setRdvs(rdvs);
      setReload(false);
    };
    if (reload) fetchData();
  }, [reload]);
  useEffect(() => {
    const filterRdvs = async () => {
      let listRdvObj = {};
      let newfilteredRdvs = [];
      let newPatientRdvs = [];
      rdvs
        .filter((e) => {
          return (
            (e.medecinId._id === selectedMedecin._id ||
              e.medecinId._id === selectedMedecin) &&
            new Date(e.datePrevu).getFullYear() === time.getFullYear() &&
            new Date(e.datePrevu).getMonth() === time.getMonth()
          );
        })

        .map((e) => {
          let date = `${new Date(e.datePrevu).getMonth() + 1}-${new Date(
            e.datePrevu
          ).getDate()}-${new Date(e.datePrevu).getFullYear()}`;
          if (e.patientId._id === selectedPatient._id) {
            newfilteredRdvs.push(e);
          }
          if (e.patientId._id) {
            newPatientRdvs.push(date);
          }
          if (!listRdvObj[date]) return (listRdvObj[date] = 1);
          else return (listRdvObj[date] += 1);
        });

      setFilteredRdvs(newfilteredRdvs);
    };
    filterRdvs();
  }, [rdvs, selectedMedecin, selectedPatient, time]);
  useEffect(() => {
    const daysInMonth = () => {
      const newNombreDays = new Date(
        time.getFullYear(),
        time.getMonth() + 1,
        0
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
    let deletedDate = filteredRdvs.find(
      (e) =>
        new Date(e.datePrevu).getFullYear() === date.getFullYear() &&
        new Date(e.datePrevu).getMonth() === date.getMonth() &&
        new Date(e.datePrevu).getDate() === date.getDate()
    );
    if (deletedDate && window.confirm("Confirmer le suppression du rdv")) {
      await deleteRdv(deletedDate._id);
      setReload(true);
      props.history.push("/ajouterrdv");
    } else if (window.confirm("Confirmer l'ajour du rdv")) {
      await saveRdv({
        patientId: selectedPatient._id,
        medecinId: selectedMedecin._id ? selectedMedecin._id : selectedMedecin,
        datePrevu: date,
      });
      setReload(true);
      props.history.push("/ajouterrdv");
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
          let found = filteredRdvs.find((e) => {
            return new Date(e.datePrevu).getDate() === d.getDate();
          });

          if (found) {
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
                  className="button-day button-day-selected"
                  onClick={() => handleSelectedDate(t)}
                >
                  <label>{countTotal + 1}</label>
                </div>
              );
            else
              arrayDiv.push(
                <div
                  key={"date-active" + countTotal}
                  className="button-day button-day-selected-old"
                  // onClick={() => handleSelectedDate(t)}
                >
                  <label>{countTotal + 1}</label>
                </div>
              );
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
                  className="button-day button-day-active"
                  onClick={() => handleSelectedDate(t)}
                >
                  <label>{countTotal + 1}</label>
                </div>
              );
            else
              arrayDiv.push(
                <div
                  key={"date-active" + countTotal}
                  className="button-day button-day-active-old"
                  // onClick={() => handleSelectedDate(t)}
                >
                  <label>{countTotal + 1}</label>
                </div>
              );
          } else if (found.nombre >= 10) {
            arrayDiv.push(
              <div
                key={"date-active" + countTotal}
                className="button-day button-day-full"
                onClick={() => handleSelectedDate(t)}
              >
                <label>{countTotal + 1}</label>
              </div>
            );
          }

          countTotal++;
        } else if (d.getDay() === 0) {
          arrayDiv.push(
            <div
              key={"date-inactif" + j}
              className="button-day button-day-inactif"
            ></div>
          );
          countTotal++;
        } else {
          arrayDiv.push(
            <div
              key={"date-inactif" + j}
              className="button-day button-day-inactif"
            ></div>
          );
        }
      }
      totalDiv.push(arrayDiv);
    } while (countTotal < nombreDays);
    return totalDiv;
  };
  return (
    <div className="component rdv-component">
      <div className="selected-time">
        <PrecedentButton
          onClick={() => {
            navigateDate(-1);
          }}
        />
        <p>{displayDate()}</p>
        <SuivantButton
          onClick={() => {
            navigateDate(1);
          }}
        />
      </div>
      <div className="name-dates">
        {days.map((e) =>
          e !== "Dimanche" ? (
            <label key={e} htmlFor={e}>
              {e}
            </label>
          ) : (
            ""
          )
        )}
      </div>
      <div className="table-dates">{displayDates()}</div>
    </div>
  );
};

export default withRouter(AgendaRdv);
