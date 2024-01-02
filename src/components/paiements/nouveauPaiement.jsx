import React, { useState, useEffect } from "react";
import { getDevi } from "../../services/deviService";
import { getNatureActes } from "../../services/natureActeService";
import { getPaiement } from "../../services/paiementService";
import MenuPaiement from "./menuPaiement";
import PatientAPayeTable from "./patientAPayeTable";
import PaiementForm from "./paiementForm";
import PatientPaiementsTable from "./patientPaiementsTable";
import PatientPaiementsReste from "./patientPaiementsReste";
import SearchPatient from "../searchPatient";

function NouveauPaiement() {
  const [natureActes, setNatureActes] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [checkChanged, setCheckChanged] = useState(false);
  const [devis, setDevis] = useState([]);

  const [montantPayeSoins, setMontantPayeSoins] = useState(0);
  const [montantPayeProtheses, setMontantPayeProtheses] = useState(0);
  const [actesEffectues, setActesEffectues] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});

  const [sortColumn, setSortColumn] = useState({
    path: "date",
    order: "desc",
  });
  useEffect(() => {
    const fetchData = async () => {
      const { data: natureActesData } = await getNatureActes();
      setNatureActes(natureActesData);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = () => {
      if (
        selectedPatient.deviIds === undefined ||
        selectedPatient.deviIds.length === 0
      )
        return setDevis([]);
      else {
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
    const fetchData = () => {
      if (selectedPatient.paiementIds !== undefined) {
        let newSelectedPaiements = [];
        if (selectedPatient.paiementIds.length === 0) {
          setMontantPayeSoins(0);
          setMontantPayeProtheses(0);
          setPaiements([]);
        } else
          selectedPatient.paiementIds.map(async (item) => {
            const { data: devi } = await getPaiement(
              item.paiementId._id || item.paiementId,
            );
            newSelectedPaiements.push(devi);
            return setPaiements([...newSelectedPaiements]);
          });
      }
      let newPayeSoins = selectedPatient.paiementIds.reduce((acc, paiement) => {
        if (paiement.isSoins === true) return acc + paiement.montant;
        else return acc;
      }, 0);
      let newPayeProtheses = selectedPatient.paiementIds.reduce(
        (acc, paiement) => {
          if (paiement.isSoins === false) return acc + paiement.montant;
          else return acc;
        },
        0,
      );
      setMontantPayeSoins(newPayeSoins);
      setMontantPayeProtheses(newPayeProtheses);
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
              _id: "",
              // nom: "",
              code: "",
              nature: "",
              medecin: "",
              dents: [],
              date: "",
              prix: "",
              isPaye: false,
            };
            acte._id = itemActe._id;
            //       Num Acte
            // //       description

            // acte.nom = itemActe.acteId.nom;
            //       code acte
            acte.code = itemActe.acteId.code;
            //       nature Acte
            acte.nature = itemActe.acteId.natureId
              ? itemActe.acteId.natureId.nom
              : "";
            //       medecinId
            acte.medecin = `${itemDevi.medecinId.nom} ${
              itemDevi.medecinId.prenom ? itemDevi.medecinId.prenom : ""
            } `;
            //       dent
            let dents = "-";
            itemActe.dentIds.map((e) => {
              return (dents += e.numero + "-");
            });

            if (dents && dents !== "-") acte.dents = dents;
            //       date
            acte.date = itemDevi.dateDevi;
            //       prix

            if (selectedPatient.adherenceId.nom === "A")
              acte.prix = itemActe.acteId.FA;
            else acte.prix = itemActe.acteId[selectedPatient.adherenceId.nom];
            acte.isPaye = itemActe.isPaye;

            actes.push(acte);
            return true;
          });
        return true;
      });
      setActesEffectues(actes);
      setCheckChanged(false);
    };

    /*  if (devis.length !== 0) */ populateActesEffectues();
  }, [devis, selectedPatient, checkChanged]);

  const handleSort = (column) => {
    setSortColumn(column);
  };

  const displayPaiement = (patient) => {
    setSelectedPatient(patient);
  };
  // const handleCheck = (acteId) => {
  //   devis.map(async (devi) => {
  //     let newDevi = { ...devi };
  //     let foundedActe = newDevi.acteEffectues.find(
  //       (acte) => acte._id === acteId
  //     );
  //     if (foundedActe) {
  //       foundedActe.isPaye = !foundedActe.isPaye;
  //       delete newDevi.__v;
  //       newDevi.medecinId = devi.medecinId._id;
  //       setCheckChanged(true);
  //       await saveDevi(newDevi);
  //     }
  //     foundedActe = undefined;
  //   });
  // };

  return (
    <>
      <MenuPaiement />
      <div className="body-devi">
        <SearchPatient onPatientSelect={displayPaiement} />

        {Object.keys(selectedPatient).length !== 0 ? (
          <>
            {
              <PatientAPayeTable
                actesEffectues={actesEffectues}
                onSort={handleSort}
                // onCheck={handleCheck}
                // montantPaye={selectedPatient.montantPaye}
                selectedPatient={selectedPatient}
                sortColumn={sortColumn}
              />
            }
            {
              <PatientPaiementsTable
                paiements={paiements}
                natureActes={natureActes}
                montantPayeSoins={montantPayeSoins}
                montantPayeProtheses={montantPayeProtheses}
                onSort={handleSort}
                sortColumn={sortColumn}
                selectedPatient={selectedPatient}
              />
            }
            {
              <PatientPaiementsReste
                selectedPatient={selectedPatient}
                montantPayeSoins={montantPayeSoins}
                montantPayeProtheses={montantPayeProtheses}
              />
            }
          </>
        ) : (
          ""
        )}
      </div>

      {Object.keys(selectedPatient).length !== 0 ? (
        <PaiementForm
          selectedPatient={selectedPatient}
          natureActes={natureActes}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default NouveauPaiement;
