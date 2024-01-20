import React, { useEffect, useState } from "react";

import { getDevis } from "../../services/deviService";
import { getPaiements } from "../../services/paiementService";
import { getActeDentaires } from "../../services/acteDentaireService";

import PatientByAgeChart from "./patientByAgeChart";
import AppointementChart from "./appointementByDayChart";
import PatientByGenderChart from "./patientByGenderChart";
import DentalProcedureChart from "./dentalProcedureChart";
import PatientRetentionChart from "./patientRetentionChart";
import AppointementTotalChart from "./appointementTotalChart";
import RevenuByTreatmentChart from "./revenuByTreatmentChart";
import RevenuByPatientAgeChart from "./revenuByPatientAgeChart";
import RevenuByPatientGenreChart from "./revenuByPatientGenreChart";

import ClipLoader from "react-spinners/ClipLoader";
import ButtonType from "../../assets/buttons/buttonType";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";
import VerticalDashedLine from "../../assets/verticalDashedLine";

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

function Accueil() {
  // const [filteredDevis, setFilteredDevis] = useState([]);
  const date = new Date();
  const [devis, setDevis] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [acteDentaires, setActeDentaires] = useState([]);
  const [totalMontantDevis, setTotalMontantDevis] = useState(0);
  const [totalMontantPaiements, setTotalMontantPaiements] = useState(0);

  const [patientsByAge, setPatientsByAge] = useState([
    { name: "0-12", number: 0, value: 12 },
    { name: "13-19", number: 0, value: 19 },
    { name: "20-29", number: 0, value: 29 },
    { name: "30-44", number: 0, value: 44 },
    { name: "45-59", number: 0, value: 59 },
    { name: "60+", number: 0, value: 60 },
  ]);
  const [patientsByGender, setPatientsByGender] = useState([
    { name: "Homme", number: 0 },
    { name: "Femme", number: 0 },
  ]);
  const [revenuByPatientGenre, setRevenuByPatientGenre] = useState([
    { name: "Homme", number: 0 },
    { name: "Femme", number: 0 },
  ]);
  const [revenuByPatientAge, setRevenuByPatientAge] = useState([
    { name: "0-12", number: 0, value: 12 },
    { name: "13-19", number: 0, value: 19 },
    { name: "20-29", number: 0, value: 29 },
    { name: "30-44", number: 0, value: 44 },
    { name: "45-59", number: 0, value: 59 },
    { name: "60+", number: 0, value: 60 },
  ]);
  const [topActeDentaires, setTopActeDentaires] = useState([]);
  const [patientRetention, setPatientRetention] = useState([
    { name: "New", number: 0 },
    { name: "Returning", number: 0 },
  ]);

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
      const { data: acteDentairesData } = await getActeDentaires();
      setDevis(devis);
      setPaiements(paiements);
      setActeDentaires(acteDentairesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredDevis = [...devis];
    let filteredPaiements = [...paiements];
    // nombre de patients par periode
    let totalDevis = 0;
    let totalPaiements = 0;

    // --------------- patient by age data --------------

    let newPatientsByAge = [
      { name: "0-12", number: 0, value: 12 },
      { name: "13-19", number: 0, value: 19 },
      { name: "20-29", number: 0, value: 29 },
      { name: "30-44", number: 0, value: 44 },
      { name: "45-59", number: 0, value: 59 },
      { name: "60+", number: 0, value: 60 },
    ];

    let newPatientsByGender = [
      { name: "Homme", number: 0 },
      { name: "Femme", number: 0 },
    ];
    let newTopActeDentaires = [];
    let newPatientRetention = [
      { name: "New", number: 0 },
      { name: "Returning", number: 0 },
    ];

    let newRevenuByPatientGenre = [
      { name: "Homme", number: 0 },
      { name: "Femme", number: 0 },
    ];
    let newRevenuByPatientAge = [
      { name: "0-12", number: 0, value: 12 },
      { name: "13-19", number: 0, value: 19 },
      { name: "20-29", number: 0, value: 29 },
      { name: "30-44", number: 0, value: 44 },
      { name: "45-59", number: 0, value: 59 },
      { name: "60+", number: 0, value: 60 },
    ];
    /* 
    

    ---------- payement------------------
     
       const revenuByPatientAge = [
        { name: "Children", number: 0, value: 12 },
        { name: "Teens", number: 0, value: 19 },
        { name: "Young Adults", number: 0, value: 29 },
        { name: "Adults", number: 0, value: 44 },
        { name: "Middle-Aged Adults", number: 0, value: 59 },
        { name: "Seniors", number: 0, value: 60 },
      ];
      


    ------------appointment data--------------
    const appointmentTypes = [
      { name: "Scheduled", number: 10 },
      { name: "Canceled", number: 50 },
      { name: "Walk-ins", number: 0 },
      { name: "Missed", number: 20 },
    ];

 */
    const uniquePatientIds = new Set();

    const getPatientData = (patient) => {
      if (uniquePatientIds.has(patient._id)) return; // Skip if patient already counted
      // check the length of patientId.deviIds if 1 then new else returning,
      if (patient.deviIds.length === 1) newPatientRetention[0].number++;
      else newPatientRetention[1].number++;

      // Categorize by age
      const age = calculateAge(patient.dateNaissance);
      for (let category of newPatientsByAge) {
        if (age <= category.value) {
          category.number++;
          break;
        }
      }
      // Categorize by gender
      if (patient.isMasculin) {
        newPatientsByGender[0].number++;
      } else {
        newPatientsByGender[1].number++;
      }

      uniquePatientIds.add(patient._id);
    };
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
            .forEach((deviItem) => {
              //----------- calculate top acte dentaire
              deviItem.acteEffectues.forEach((acteDentaire) => {
                const foundedActeDentaire = acteDentaires.find(
                  (data) =>
                    data._id.toString() === acteDentaire.acteId.toString(),
                );
                if (foundedActeDentaire) {
                  // top acte dentaire
                  const indexTopActeDentaires = newTopActeDentaires.findIndex(
                    (data) => data.name === foundedActeDentaire.nom,
                  );
                  if (indexTopActeDentaires === -1) {
                    newTopActeDentaires.push({
                      name: foundedActeDentaire.nom,
                      number: 1,
                      montant: foundedActeDentaire.prix,
                    });
                  } else {
                    newTopActeDentaires[indexTopActeDentaires].number++;
                    newTopActeDentaires[indexTopActeDentaires].montant +=
                      foundedActeDentaire.prix;
                  }

                  // revenu by patient genre
                  // if deviItem.patientId.isMasculin
                  if (deviItem.patientId.isMasculin) {
                    newRevenuByPatientGenre[0].number += acteDentaire.prix;
                  } else {
                    newRevenuByPatientGenre[1].number += acteDentaire.prix;
                  }
                  // revenu by patient age
                  const age = calculateAge(deviItem.patientId.dateNaissance);
                  for (let category of newRevenuByPatientAge) {
                    if (age <= category.value) {
                      category.number += acteDentaire.prix;
                      break;
                    }
                  }
                }
              });
              // calculate the retentation

              totalDevis += deviItem.montant;
              getPatientData(deviItem.patientId);
            });
          filteredPaiements = filteredPaiements
            .filter(
              (data) =>
                new Date(data.date).getMonth() === time.value.getMonth() &&
                new Date(data.date).getFullYear() === time.value.getFullYear(),
            )
            .forEach((paiementItem) => {
              totalPaiements += paiementItem.montant;
            });
          setTopActeDentaires(newTopActeDentaires);
          setRevenuByPatientGenre(newRevenuByPatientGenre);
          console.log("1", newRevenuByPatientAge);
          setRevenuByPatientAge(newRevenuByPatientAge);
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
      setPatientsByAge(newPatientsByAge);
      setPatientsByGender(newPatientsByGender);
      setPatientRetention(newPatientRetention);
    };
    getData();
  }, [devis, paiements, acteDentaires, time]);

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
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border bg-[#E5EEEB] shadow-component ">
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
      {loading ? (
        <div className="spinner">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2 flex flex-wrap">
          {/*------------ patient demographic--------------- */}
          <div className="m-2  w-fit  rounded-xl bg-gradient-to-b from-[#668089] to-[#2E4756] shadow-custom">
            <h2 className=" rounded-lg bg-[#2E4756] p-2 text-2xl font-bold text-white shadow-md">
              Patient Demographics
            </h2>
            <div className="flex ">
              <div className="m-2">
                <PatientByAgeChart data={patientsByAge} />
              </div>
              <VerticalDashedLine />

              <div className="m-2">
                <PatientByGenderChart data={patientsByGender} />
              </div>
            </div>
          </div>
          {/* ------------appointement statistics------------ */}
          <div className="m-2 h-fit  w-fit rounded-xl bg-gradient-to-b from-[#668089] to-[#2E4756] shadow-custom">
            {/*             <div className="m-2">
              <AppointementChart />
            </div> */}
            <h2 className=" rounded-lg bg-[#2E4756] p-2 text-2xl font-bold text-white shadow-md">
              Appointment Statistics
            </h2>
            <div className="flex ">
              <div className="m-2">
                <AppointementTotalChart />
              </div>
            </div>
          </div>
          {/*-------------treatement types and frequencies--------------- */}
          <div className="m-2 h-fit w-fit rounded-xl bg-gradient-to-b from-[#668089] to-[#2E4756]  shadow-custom">
            <h2 className=" rounded-lg bg-[#2E4756] p-2 text-2xl font-bold text-white shadow-md">
              Treatement types and frequencies
            </h2>
            <div className="flex ">
              <div className="m-2">
                <DentalProcedureChart data={topActeDentaires} />
              </div>
            </div>
          </div>
          {/* patient retention rates to understand patient loyalty (new vs returning) */}

          <div className="m-2  h-fit w-fit rounded-xl bg-gradient-to-b from-[#668089] to-[#2E4756] shadow-custom">
            <h2 className=" rounded-lg bg-[#2E4756] p-2 text-2xl font-bold text-white shadow-md">
              Patient Retention Rates
            </h2>
            <div className="flex ">
              <div className="m-2">
                <PatientRetentionChart data={patientRetention} />
              </div>
            </div>
          </div>
          {/* -------------revenue and payement perforemd------------- */}
          <div className="m-2 h-fit  w-fit rounded-xl bg-gradient-to-b from-[#668089] to-[#2E4756] shadow-custom">
            <h2 className=" rounded-lg bg-[#2E4756] p-2 text-2xl font-bold text-white shadow-md">
              Revenue and Payment Trends
            </h2>
            <div className="flex ">
              <div className="m-2 ">
                <RevenuByTreatmentChart data={topActeDentaires} />
              </div>
              <VerticalDashedLine />

              <div className="m-2">
                <RevenuByPatientGenreChart data={revenuByPatientGenre} />
              </div>
              <VerticalDashedLine />
              <div className="m-2">
                <RevenuByPatientAgeChart data={revenuByPatientAge} />
              </div>
            </div>
          </div>

          {/* waiting time and service efficiency: average waiting time and duration of appointment */}
        </div>
      )}
    </div>
  );
}

export default Accueil;
