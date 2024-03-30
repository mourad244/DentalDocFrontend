import React, { useState, useEffect } from "react";
import "./searchPeriode.css";

function SearchPeriode({ selectedDates, onSelectDates }) {
  const [dateDebut, setDateDebut] = useState(
    selectedDates ? selectedDates.dateDebut : "",
  );
  const [dateFin, setDateFin] = useState(
    selectedDates ? selectedDates.dateFin : "",
  );
  const [textError, setTextError] = useState("");

  useEffect(() => {
    if (dateDebut && dateFin) {
      if (dateDebut > dateFin) {
        setTextError("La date de début doit être antérieure à la date de fin.");
        // Reset selected dates to initial state if the current range is invalid
        onSelectDates({ dateDebut: "", dateFin: "" });
      } else {
        setTextError("");
        // If dates are correct, pass them to the parent component.
        onSelectDates({
          dateDebut: dateDebut,
          dateFin: dateFin,
        });
      }
    } else {
      // Also reset if either date is cleared to ensure consistent state management
      setTextError("");
      onSelectDates({ dateDebut: "", dateFin: "" });
    }
  }, [dateDebut, dateFin]); // Only re-run the effect if dateDebut or dateFin changes

  const handleClearDates = () => {
    setDateDebut("");
    setDateFin("");
    setTextError("");
    // Explicitly reset selected dates on clear action
    onSelectDates({ dateDebut: "", dateFin: "" });
  };

  return (
    <div className="search-component search-component-date">
      <label htmlFor="query">Recherche par date</label>
      <div className="search-date-debut">
        <label htmlFor="debut">Début</label>
        <input
          type="date"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.currentTarget.value)}
        />
      </div>
      <div className="search-date-fin">
        <label htmlFor="fin">Fin</label>
        <input
          type="date"
          value={dateFin}
          onChange={(e) => setDateFin(e.currentTarget.value)}
        />
      </div>
      {textError && <div className="error-date">{textError}</div>}
      <div className="buttons-date">
        <button className="clear-date" onClick={handleClearDates}>
          X
        </button>
      </div>
    </div>
  );
}

export default SearchPeriode;
