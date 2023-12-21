import React, { useState } from "react";
import ButtonType from "../../assets/buttons/buttonType";
import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";
import "./accueil.css";
// import icon from "../../assets/images/icon-DGSS.png";

function Accueil() {
  // const [filteredDevis, setFilteredDevis] = useState([]);
  const date = new Date();

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
  // const [totalCount, setTotalCount] = useState(0);

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
    <div className="accueil">
      <div className="time">
        <ul>
          {times.map((data, index) => (
            <li key={data.nom + index} onClick={() => updateTimeChanged(index)}>
              {ButtonType(data.nom, data.active)}
            </li>
          ))}
        </ul>
      </div>
      {time.nom !== "tous" ? (
        <div className="selected-time">
          <PrecedentButton
            onClick={() => {
              navigateDate(time, -1);
            }}
          />
          <p>{displayDate(time.nom)}</p>

          <SuivantButton
            onClick={() => {
              navigateDate(time, 1);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Accueil;
