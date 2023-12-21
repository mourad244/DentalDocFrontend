import React, { useState, useEffect } from "react";
import { getDevi } from "../../services/deviService";
import ActesEffectuesTable from "./actesEffectuesTable";
import DeviForm from "./deviForm";

import MenuDevi from "./menuDevi";
import "./nouveauDevi.css";
import SearchPatient from "../searchPatient";

function NouveauDevi() {
  const [devis, setDevis] = useState([]);
  const [actesEffectues, setActesEffectues] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});

  const [sortColumn, setSortColumn] = useState({
    path: "date",
    order: "desc",
  });

  useEffect(() => {
    const fetchData = () => {
      if (
        selectedPatient.deviIds !== undefined &&
        selectedPatient.deviIds !== null &&
        selectedPatient.deviIds.length !== 0
      ) {
        let newSelectedDevis = [];
        selectedPatient.deviIds.map(async (item) => {
          const { data: devi } = await getDevi(item.deviId._id || item.deviId);
          newSelectedDevis.push(devi);
          return setDevis([...newSelectedDevis]);
        });
      }
    };

    if (Object.keys(selectedPatient).length !== 0) fetchData();
  }, [selectedPatient]);
  useEffect(() => {
    const populateActesEffectues = () => {
      let actes = [];
      devis.map((itemDevi) => {
        //----------in array inside acteId -------
        if (itemDevi.acteEffectues !== undefined)
          itemDevi.acteEffectues.map((itemActe) => {
            let acte = {
              date: "",
              medecin: "",
              nature: "",
              code: "",
              nom: "",
              dents: [],
            };
            //       date
            acte.date = itemDevi.dateDevi;
            //       medecinId
            acte.medecin = `${
              itemDevi.medecinId && itemDevi.medecinId.gradeId
                ? itemDevi.medecinId.gradeId.nom
                : ""
            } ${itemDevi.medecinId.nom} ${
              itemDevi.medecinId.prenom ? itemDevi.medecinId.prenom : ""
            } `;
            //       nature Acte
            acte.nature = itemActe.acteId.natureId
              ? itemActe.acteId.natureId.nom
              : "";
            //       code acte
            acte.code = itemActe.acteId.code;
            //       description
            acte.nom = itemActe.acteId.nom;

            //       Num Acte
            //       dent
            let dents = "-";
            itemActe.dentIds.map((e) => {
              return (dents += e.numero + "-");
            });
            if (dents && dents !== "-") acte.dents = dents;

            actes.push(acte);
            return true;
          });
        return true;
      });
      setActesEffectues(actes);
    };

    if (devis.length !== 0) populateActesEffectues();
  }, [devis]);

  const handleSort = (column) => {
    setSortColumn(column);
  };

  const displayPatient = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <>
      <MenuDevi />

      <div className="body-devi">
        <SearchPatient onPatientSelect={displayPatient} />
      </div>

      {actesEffectues.length !== 0 ? (
        <ActesEffectuesTable
          onSort={handleSort}
          actesEffectuees={actesEffectues}
          sortColumn={sortColumn}
        />
      ) : (
        ""
      )}
      {Object.keys(selectedPatient).length !== 0 ? (
        <DeviForm selectedPatient={selectedPatient} />
      ) : (
        ""
      )}
    </>
  );
}

export default NouveauDevi;
