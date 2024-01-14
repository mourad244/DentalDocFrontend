import React, { useEffect, useState } from "react";
import { getDevis } from "../../services/deviService";
import { getPaiements } from "../../services/paiementService";

import PatientByAgeChart from "./patientByAgeChart";
import PatientByGenderChart from "./patientByGenderChart";

import ButtonType from "../../assets/buttons/buttonType";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";
import AppointementChart from "./appointementByDayChart";
import AppointementTotalChart from "./appointementTotalChart";
import DentalProcedureChart from "./dentalProcedureChart";
import RevenuByTreatmentChart from "./revenuByTreatmentChart";
import RevenuByPatientGenreChart from "./revenuByPatientGenreChart";
import RevenuByPatientAgeChart from "./revenuByPatientAgeChart";
function Accueil() {
  // const [filteredDevis, setFilteredDevis] = useState([]);
  const date = new Date();
  const [devis, setDevis] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [totalMontantDevis, setTotalMontantDevis] = useState(0);
  const [totalMontantPaiements, setTotalMontantPaiements] = useState(0);
  const [times, setTimes] = useState([
    { nom: "journee", active: false },
    // { nom: "semaine", active: false },
    { nom: "mois", active: true },
    // { nom: "trimestre", active: false },
    // { nom: "semestre", active: false },
    { nom: "annee", active: false },
    { nom: "tous", active: false },
  ]);
  const [time, setTime] = useState({
    nom: "mois",
    value: date,
    active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: devis } = await getDevis();
      const { data: paiements } = await getPaiements();
      setDevis(devis);
      setPaiements(paiements);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // nombre de et devis et paiements par periode
    let filteredDevis = [...devis];
    let filteredPaiements = [...paiements];
    // nombre de patients par periode
    let totalDevis = 0;
    let totalPaiements = 0;
    const getData = () => {
      switch (time.nom) {
        case "journee":
          filteredDevis = filteredDevis
            .filter(
              (data) =>
                new Date(data.dateDevi).getDate() === time.value.getDate() &&
                new Date(data.dateDevi).getMonth() === time.value.getMonth() &&
                new Date(data.dateDevi).getFullYear() ===
                  time.value.getFullYear(),
            )
            .map((data) => {
              totalDevis += data.montant;
              return data;
            });
          filteredPaiements = filteredPaiements
            .filter(
              (data) =>
                new Date(data.date).getDate() === time.value.getDate() &&
                new Date(data.date).getMonth() === time.value.getMonth() &&
                new Date(data.date).getFullYear() === time.value.getFullYear(),
            )
            .map((data) => {
              totalPaiements += data.montant;
              return data;
            });
          break;
        case "semaine":
          break;
        case "mois":
          filteredDevis = filteredDevis
            .filter(
              (data) =>
                new Date(data.dateDevi).getMonth() === time.value.getMonth() &&
                new Date(data.dateDevi).getFullYear() ===
                  time.value.getFullYear(),
            )
            // add the total of filtered devis
            .map((data) => {
              totalDevis += data.montant;
              return data;
            });
          filteredPaiements = filteredPaiements
            .filter(
              (data) =>
                new Date(data.date).getMonth() === time.value.getMonth() &&
                new Date(data.date).getFullYear() === time.value.getFullYear(),
            )
            .map((data) => {
              totalPaiements += data.montant;
              return data;
            });

          break;
        case "trimestre":
          break;
        case "semestre":
          break;
        case "annee":
          filteredDevis = filteredDevis.filter(
            (data) =>
              new Date(data.dateDevi).getFullYear() ===
              time.value.getFullYear(),
          );
          filteredPaiements = filteredPaiements.filter(
            (data) =>
              new Date(data.date).getFullYear() === time.value.getFullYear(),
          );
          break;
        case "tous":
          break;
        default:
          break;
      }
      setTotalMontantDevis(totalDevis);
      setTotalMontantPaiements(totalPaiements);
    };
    getData();
  }, [devis, paiements, time]);

  const updateTimeChanged = (index) => {
    let newArray = [...times];
    newArray.map((data) => (data.active = false));
    newArray[index].active = true;
    setTimes(newArray);

    setTime({
      nom: newArray[index].nom,
      value: date,
      active: true,
    });
  };
  const displayDate = (periode) => {
    switch (periode) {
      case "journee":
        return (
          time.value.getDate() +
          " - " +
          (time.value.getMonth() + 1) +
          " - " +
          time.value.getFullYear()
        );
      case "semaine":
        return;
      case "mois":
        return time.value.getMonth() + 1 + " - " + time.value.getFullYear();
      case "trimestre":
        break;
      case "semestre":
        break;
      case "annee":
        return time.value.getFullYear();
      default:
        break;
    }
  };
  const navigateDate = (time, operation) => {
    let periode;
    switch (time.nom) {
      case "journee":
        periode = { ...time };
        periode.value = new Date(
          periode.value.setDate(periode.value.getDate() + operation),
        );
        setTime(periode);

        break;
      case "semaine":
        break;
      case "mois":
        periode = { ...time };
        periode.value = new Date(
          periode.value.setMonth(periode.value.getMonth() + operation),
        );
        setTime(periode);

        break;
      case "trimestre":
        break;
      case "semestre":
        break;
      case "annee":
        periode = { ...time };
        periode.value = new Date(
          periode.value.setFullYear(periode.value.getFullYear() + operation),
        );
        setTime(periode);

        break;
      case "tous":
        break;
      default:
        break;
    }
  };

  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component">
      <div className="mx-2 flex h-14">
        <ul className="m-auto flex list-none rounded-md bg-[#f5f5f5] p-2 shadow-custom">
          {times.map((data, index) => (
            <li key={data.nom + index} onClick={() => updateTimeChanged(index)}>
              {ButtonType(data.nom, data.active)}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex">
        {time.nom !== "tous" && (
          <div className=" m-auto my-2 flex items-center rounded-md bg-[#f5f5f5] p-2 shadow-md">
            <PrecedentButton
              className="cursor-pointer"
              onClick={() => {
                navigateDate(time, -1);
              }}
            />
            <p className="text-md m-auto mx-3 font-bold leading-5">
              {displayDate(time.nom)}
            </p>
            <SuivantButton
              className="cursor-pointer"
              onClick={() => {
                navigateDate(time, 1);
              }}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col ">
        {/*------------ patient demographic--------------- */}
        <div className="m-2">
          <PatientByAgeChart />
        </div>
        <div className="m-2">
          <PatientByGenderChart />
        </div>
        {/* ------------appointement statistics------------ */}
        <div className="m-2">
          <AppointementChart />
        </div>
        <div className="m-2">
          <AppointementTotalChart />
        </div>
        {/*-------------treatement types and frequencies--------------- */}
        <div className="m-2">
          <DentalProcedureChart />
        </div>
        {/* -------------revenue and payement perforemd------------- */}
        <div className="m-2">
          <RevenuByTreatmentChart />
        </div>
        <div className="m-2">
          <RevenuByPatientGenreChart />
        </div>
        <div className="m-2">
          <RevenuByPatientAgeChart />
        </div>
        {/* patient retention rates to understand patient loyalty (new vs returning) */}

        {/* waiting time and service efficiency: average waiting time and duration of appointment */}
      </div>
    </div>
  );
}

export default Accueil;
