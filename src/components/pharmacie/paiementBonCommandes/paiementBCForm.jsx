import React from "react";
import { withRouter } from "react-router-dom";

import { getDevi } from "../../services/deviService";
import { getPatient } from "../../services/patientService";
import { getNatureActes } from "../../services/natureActeService";
import { getActeDentaires } from "../../services/acteDentaireService";
import { savePaiementBC, getPaiementBC } from "../../services/paiementService";

import Form from "../../common/form";
import PaiementBCActesTable from "./paiementActesTable";
import PaiementBCEffectuesTable from "./paiementEffectuesTable";

import Joi from "joi-browser";
import ClipLoader from "react-spinners/ClipLoader";

import { IoChevronBackCircleSharp } from "react-icons/io5";
import SearchPatient from "../../common/searchPatient";
// import RecuPaiementBC from "../../documents/recuPaiementBC";

class PaiementBCForm extends Form {
  state = {
    data: {
      patientId: "",
      date: new Date(),
      montant: "",
      mode: "Espèce",
      numCheque: undefined,
      numOrdre: "",
    },
    errors: {},
    patients: [],
    selectedPatient: {},
    acteDentaires: [],
    natureActes: [],
    sortColumn: { path: "date", order: "desc" },
    devis: [],
    paiements: [],
    actesEffectues: [],
    nombreActes: 1,
    loading: false,
    loadingPatient: false,
  };

  schema = {
    _id: Joi.string(),
    patientId: Joi.string().allow("").label("Patient"),
    date: Joi.date().label("Date"),
    montant: Joi.number().required().label("Montant"),
    mode: Joi.string().label("Mode PaiementBC"),
    numCheque: Joi.string().allow("").label("Numero Cheque"),
    numOrdre: Joi.number().allow("").allow(null).label("Numéro d'ordre"),
  };

  async populateDatas() {
    this.setState({ loading: true });
    const paiementId = this.props.match.params.paiementid;
    const patientId = this.props.match.params.patientid;
    console.log("paiementId", paiementId);
    console.log("patientId", patientId);
    if (paiementId === "new" || paiementId === undefined) {
      const { data: natureActes } = await getNatureActes();
      const { data: acteDentaires } = await getActeDentaires();
      if (patientId) {
        const { data: patient } = await getPatient(patientId);
        let newData = { ...this.state.data };
        let newSelectedPaiementBCs = [];
        let newSelectedDevis = [];
        if (
          patient.deviIds !== undefined &&
          patient.deviIds !== null &&
          patient.deviIds.length !== 0
        ) {
          const promises = patient.deviIds.map((item) =>
            getDevi(item.deviId._id),
          );
          const devisResults = await Promise.all(promises);
          newSelectedDevis = devisResults.map(({ data: devi }) => devi);
        }
        if (
          patient.paiementIds !== undefined &&
          patient.paiementIds !== null &&
          patient.paiementIds.length !== 0
        ) {
          const promises = patient.paiementIds.map((item) =>
            getPaiementBC(item.paiementId._id),
          );
          const paiementsResults = await Promise.all(promises);
          newSelectedPaiementBCs = paiementsResults.map(
            ({ data: paiement }) => paiement,
          );
        }
        newData.patientId = patient._id;
        this.setState({
          data: newData,
          selectedPatient: patient,
          devis: newSelectedDevis,
          paiements: newSelectedPaiementBCs,
          natureActes,
          acteDentaires,
          loaded: true,
        });
      }
      this.setState({
        natureActes,
        acteDentaires,
      });
    } else {
      const { data: paiement } = await getPaiementBC(paiementId);
      const { data: natureActes } = await getNatureActes();
      const { data: acteDentaires } = await getActeDentaires();
      this.setState({
        data: this.mapToViewModel(paiement),
        selectedPatient: paiement.patientId,
        acteDentaires,
        natureActes,
      });
    }
    this.setState({ loading: false });
  }

  onSelectPatient = async (patient) => {
    this.setState({
      loadingPatient: true,
    });
    let data = { ...this.state.data };
    const { data: fetchedPatient } = await getPatient(patient._id);
    let newSelectedPaiementBCs = [];
    let newSelectedDevis = [];

    if (
      fetchedPatient.deviIds !== undefined &&
      fetchedPatient.deviIds !== null &&
      fetchedPatient.deviIds.length !== 0
    ) {
      const promises = fetchedPatient.deviIds.map((item) =>
        getDevi(item.deviId._id),
      );
      const devisResults = await Promise.all(promises);
      newSelectedDevis = devisResults.map(({ data: devi }) => devi);
    }
    if (
      fetchedPatient.paiementIds !== undefined &&
      fetchedPatient.paiementIds !== null &&
      fetchedPatient.paiementIds.length !== 0
    ) {
      const promises = fetchedPatient.paiementIds.map((item) =>
        getPaiementBC(item.paiementId._id),
      );
      const paiementsResults = await Promise.all(promises);
      newSelectedPaiementBCs = paiementsResults.map(
        ({ data: paiement }) => paiement,
      );
    }
    data.patientId = fetchedPatient._id;
    this.setState({
      data,
      selectedPatient: fetchedPatient,
      devis: newSelectedDevis,
      paiements: newSelectedPaiementBCs,
      loadingPatient: false,
    });
  };
  async componentDidMount() {
    await this.populateDatas();
  }

  async componentDidUpdate(prevProps, prevState) {
    // if searchQuery change filteredPatients

    if (prevState.devis !== this.state.devis) {
      let actes = [];
      const totalPaiementBCs = this.state.selectedPatient.totalPaiementBCs;
      let restePaiementBCs = totalPaiementBCs;

      this.state.devis.map((itemDevi) => {
        if (itemDevi.acteEffectues !== undefined)
          itemDevi.acteEffectues.map((itemActe) => {
            let acte = {
              date: "",
              medecin: "",
              nature: "",
              code: "",
              nom: "",
              dents: [],
              prix: 0,
              reste: 0,
            };
            //       date
            acte.date = itemDevi.dateDevi;
            //       medecinId
            acte.medecin = `${itemDevi.medecinId.nom} ${
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
              return (dents += e.numeroFDI + "-");
            });
            acte.dents = dents;
            acte.prix = itemActe.prix ? itemActe.prix : 0;
            if (restePaiementBCs >= acte.prix) {
              restePaiementBCs -= acte.prix;
              acte.reste = 0;
            } else if (restePaiementBCs < acte.prix && restePaiementBCs !== 0) {
              acte.reste = acte.prix - restePaiementBCs;
              restePaiementBCs = 0;
            } else {
              acte.reste = acte.prix;
            }

            actes.push(acte);
            return true;
          });
        return true;
      });
      this.setState({ actesEffectues: actes });
    }
  }
  mapToViewModel(paiement) {
    return {
      _id: paiement._id,
      patientId: paiement.patientId._id,
      date: paiement.date,
      montant: paiement.montant,
      mode: paiement.mode,
      numCheque: paiement.numCheque,
      numOrdre: paiement.numOrdre,
    };
  }
  doSubmit = async () => {
    let data = { ...this.state.data };
    await savePaiementBC(data);
    this.props.history.push("/paiements");
  };
  handleModePaiementBCSelect = (e) => {
    let paiements = { ...this.state.data };
    paiements.mode = e.target.value;
    this.setState({ data: paiements });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  render() {
    const {
      // data,
      selectedPatient,
      loading,
      loadingPatient,
      actesEffectues,
      paiements,
      // devis,
    } = this.state;
    const paiementId = this.props.match.params.paiementid;
    const patientId = this.props.match.params.patientid;
    return loading ? (
      <div className="m-auto my-4">
        <ClipLoader loading={loading} size={70} />
      </div>
    ) : (
      <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
          Formulaire du paiement
        </p>
        <div className="ml-2  flex justify-start">
          <button
            className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
            onClick={() => {
              this.props.history.push("/paiements");
            }}
          >
            <IoChevronBackCircleSharp className="mr-1" />
            Retour à la Liste
          </button>
        </div>
        {paiementId === "new" && (
          <SearchPatient onPatientSelect={this.onSelectPatient} />
        )}
        {loadingPatient ? (
          <div className="m-auto my-4">
            <ClipLoader loading={loadingPatient} size={70} />
          </div>
        ) : (
          Object.keys(selectedPatient).length !== 0 && (
            <>
              <div className="m-2  rounded-sm bg-[#4F6874] p-2">
                <p className="text-center text-base font-bold text-white">{`${
                  selectedPatient.nom && selectedPatient.nom.toUpperCase()
                } ${
                  selectedPatient.prenom && selectedPatient.prenom.toUpperCase()
                }`}</p>
              </div>
              {(paiementId === "new" || patientId) && (
                <div className="flex flex-wrap">
                  <PaiementBCActesTable
                    actesEffectuees={actesEffectues}
                    onSort={this.handleSort}
                    sortColumn={this.state.sortColumn}
                    totalDevis={selectedPatient.totalDevis}
                    totalPaiementBCs={selectedPatient.totalPaiementBCs}
                  />

                  <PaiementBCEffectuesTable
                    paiements={paiements}
                    onSort={this.handleSort}
                    sortColumn={this.state.sortColumn}
                    totalPaiementBCs={selectedPatient.totalPaiementBCs}
                  />
                </div>
              )}
              <div className="m-2 bg-[#a2bdc5]">
                <p className="w-full bg-[#81b9ca] p-2 text-xl font-bold text-[#474a52]">
                  PaiementBC
                </p>
                <form onSubmit={this.handleSubmit}>
                  <div className="flex flex-wrap">
                    <div className="mt-3">
                      {this.renderDate("date", "Date", 170, 35, 140)}
                    </div>
                    <div className="mt-3">
                      {this.renderInput(
                        "montant",
                        "Montant",
                        170,
                        35,
                        "number",
                        140,
                      )}
                    </div>
                    <div className="mt-3">
                      <div className=" flex w-fit flex-wrap">
                        <label
                          className="mr-3 text-right text-xs font-bold leading-9 text-[#72757c]"
                          htmlFor={"modePaiementBC"}
                          style={{ width: 140 }}
                        >
                          Mode PaiementBC
                        </label>
                        <div className="flex w-fit flex-wrap">
                          <select
                            id={"modePaiementBC"}
                            name="mode"
                            style={{
                              height: 35,
                              width: 170,
                            }}
                            className=" w-24 rounded-md	border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                            onChange={(e) => this.handleModePaiementBCSelect(e)}
                          >
                            {["Espèce", "Chèque"].map((option) => {
                              return (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="m-3">{this.renderButton("Sauvegarder")}</div>
                </form>
              </div>
            </>
          )
        )}

        {/* {data.patientId ? (
          <RecuPaiementBC
            data={{ ...this.state.data }}
            selectedPatient={this.props.selectedPatient}
            natureActes={this.props.natureActes}
          />
        ) : (
          ""
        )} */}
      </div>
    );
  }
}

export default withRouter(PaiementBCForm);
