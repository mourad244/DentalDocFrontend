import React from "react";
import { withRouter } from "react-router-dom";
import { getDents } from "../../services/dentService";
import { getPatients } from "../../services/patientService";
import { getMedecins } from "../../services/medecinService";
import { saveDevi, getDevi } from "../../services/deviService";
import { getNatureActes } from "../../services/natureActeService";
import { getActeDentaires } from "../../services/acteDentaireService";

import Joi from "joi-browser";
import Form from "../../common/form";
import Input from "../../common/input";
import Select from "../../common/select";
import SearchBox from "../../common/searchBox";
import ActesEffectuesTable from "./actesEffectuesTable";

import _ from "lodash";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import SchemaDent from "../../assets/icons/graphs/schemaDent";
import { colorsNatureActe } from "../../utils/colorsNatureActe";

class DeviForm extends Form {
  state = {
    data: {
      patientId: "",
      medecinId: "",
      dateDevi: "",
      acteEffectues: [],
    },
    errors: {},
    medecins: [],
    patients: [],
    selectedPatient: {},
    filteredPatients: [],
    searchQuery: "",
    acteDentaires: [],
    natureActes: [],
    dents: [],
    sortColumn: { path: "date", order: "desc" },
    devis: [],
    actesEffectues: [],
    nombreActes: 1,
    selectedNatureActes: [],
    selectedActes: [],
    selectedDents: [],
    colors: colorsNatureActe,
    filteredActeDentaires: [],
    nombreDentsPerActe: [],
  };
  schema = {
    _id: Joi.string(),
    patientId: Joi.string().allow("").label("Patient"),
    medecinId: Joi.string().allow("").label("Medecin"),
    dateDevi: Joi.date().label("Date"),
    acteEffectues: Joi.array().allow([]).label("Acte Effectues"),
  };
  async populateDatas() {
    try {
      const deviId = this.props.match.params.id;
      if (deviId === "new" || deviId === undefined) {
        const { data: dents } = await getDents();
        const { data: medecins } = await getMedecins();
        const { data: acteDentaires } = await getActeDentaires();
        const { data: natureActes } = await getNatureActes();
        const { data: patients } = await getPatients();
        this.setState({
          dents,
          medecins,
          acteDentaires,
          natureActes,
          patients,
        });
      } else {
        const { data: devi } = await getDevi(deviId);
        const { data: dents } = await getDents();
        const { data: medecins } = await getMedecins();
        const { data: acteDentaires } = await getActeDentaires();
        const { data: natureActes } = await getNatureActes();

        this.setState({
          data: this.mapToViewModel(devi),
          selectedPatient: devi.patientId,
          dents,
          medecins,
          acteDentaires,
          natureActes,
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  onSelectPatient = async (patient) => {
    let data = { ...this.state.data };
    if (
      patient.deviIds !== undefined &&
      patient.deviIds !== null &&
      patient.deviIds.length !== 0
    ) {
      let newSelectedDevis = [];
      const promises = patient.deviIds.map((item) => getDevi(item.deviId._id));
      const devisResults = await Promise.all(promises);
      newSelectedDevis = devisResults.map(({ data: devi }) => devi);

      return this.setState({
        devis: [...newSelectedDevis],
        selectedPatient: patient,
        searchQuery: "",
        data: {
          ...data,
          patientId: patient._id,
        },
      });
    } else
      this.setState({
        selectedPatient: patient,
        searchQuery: "",
        data: {
          ...data,
          patientId: patient._id,
        },
      });
  };

  async componentDidMount() {
    await this.populateDatas();
  }

  async componentDidUpdate(prevProps, prevState) {
    // if searchQuery change filteredPatients
    if (prevState.searchQuery !== this.state.searchQuery) {
      const newFilteredPatients = this.state.patients.filter((patient) => {
        return (
          patient.nom
            .toLowerCase()
            .includes(this.state.searchQuery.toLowerCase()) ||
          patient.prenom
            .toLowerCase()
            .includes(this.state.searchQuery.toLowerCase())
        );
      });
      this.state.searchQuery === ""
        ? this.setState({ filteredPatients: [] })
        : this.setState({ filteredPatients: newFilteredPatients });
    }
    if (prevState.devis !== this.state.devis) {
      let actes = [];
      this.state.devis.map((itemDevi) => {
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
            actes.push(acte);
            return true;
          });
        return true;
      });
      this.setState({ actesEffectues: actes });
    }
  }
  mapToViewModel(devi) {
    return {
      _id: devi._id,
      patientId: devi.patientId._id,
      medecinId: devi.medecinId && devi.medecin._id ? devi.medecinId._id : "",
      dateDevi: devi.dateDevi,
      acteEffectues: devi.acteEffectues ? devi.acteEffectues : [],
    };
  }

  doSubmit = async () => {
    let selectedActes = [...this.state.selectedActes];
    let montant = 0;
    selectedActes.map((acteItem, index) => {
      montant += acteItem.prix;
    });

    let newData = { ...this.state.data };
    newData.montant = montant;

    await saveDevi(newData);
    this.props.history.push("/devis");
  };
  defineActeLines = (e) => {
    e.preventDefault();
    this.setState({ nombreActes: e.target.value });
  };

  handleSelectedNature = (e, index) => {
    let selectedNatureActes = [...this.state.selectedNatureActes];
    let filteredActeDentaires = [...this.state.filteredActeDentaires];
    let selectedActes = [...this.state.selectedActes];
    let nombreDentsPerActe = [...this.state.nombreDentsPerActe];
    let selectedDents = [...this.state.selectedDents];

    let selectedNatureActe = { ...selectedNatureActes[index] };
    const selected = this.state.natureActes.find(
      (item) => item._id === e.target.value,
    );
    selectedNatureActe = selected;
    /* if (!selected) {
      // delete nature Acte in array
      selectedNatureActes.splice(index, 1);
      //delete filteredActe
      filteredActeDentaires.splice(index, 1);
      // delete acte in array
      selectedActes.splice(index, 1);
      // delete nombre Dent
      nombreDentsPerActe.splice(index, 1);
      // reset nombreDent
      nombreDentsPerActe.splice(index, 1);
      this.setState({
        filteredActeDentaires,
        selectedNatureActes,
        selectedActes,
        nombreDentsPerActe,
        selectedDents,
      });
    } else { */
    selectedNatureActes[index] = selectedNatureActe;

    // set filtered actes dentaires
    let filteredActeDentaire = { ...filteredActeDentaires[index] };
    filteredActeDentaire = this.state.acteDentaires.filter((e) => {
      return selected ? e.natureId && e.natureId._id === selected._id : "";
    });
    filteredActeDentaires[index] = filteredActeDentaire;

    // reset selectedActe
    delete selectedActes[index];
    // reset nombreDent
    nombreDentsPerActe[index] = 0;

    // reset selectedDent
    delete selectedDents[index];
    this.setState({
      filteredActeDentaires,
      selectedNatureActes,
      selectedActes,
      nombreDentsPerActe,
      selectedDents,
    });
    // }
  };

  handleSelectedActe = (e, index) => {
    let selectedActes = [...this.state.selectedActes];
    let selectedActe = { ...selectedActes[index] };

    const selected = this.state.acteDentaires
      //
      .find((item) => item._id === e.target.value);

    selectedActe = selected;
    selectedActes[index] = selectedActe;

    // set data
    let devis = { ...this.state.data };
    let acteEffectue = { acteId: "", dentIds: [] };
    acteEffectue.acteId = selected ? selected._id : "";
    if (!devis.acteEffectues[index]) {
      devis.acteEffectues[index] = {
        acteId: "",
        dentIds: [],
      };
    }

    devis.acteEffectues[index]["acteId"] = acteEffectue.acteId;

    this.setState({ selectedActes, data: devis });
  };

  defineNombreDentsPerActe = (e, indexActe) => {
    e.preventDefault();
    let nombreDentsPerActe = [...this.state.nombreDentsPerActe];
    nombreDentsPerActe[indexActe] = parseInt(e.target.value);
    this.setState({ nombreDentsPerActe });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSelectedDent = (e, indexActe, indexDent) => {
    let selectedDents = [...this.state.selectedDents];
    let selectedDent = { ...selectedDents[indexActe] };
    const selected = this.state.dents.find(
      (item) => item._id === e.target.value,
    );
    selectedDent[indexDent] = selected;
    selectedDents[indexActe] = selectedDent;
    // set data
    let devis = { ...this.state.data };
    let acteEffectue = { acteId: "", dentIds: [] };
    acteEffectue.dentIds = selected ? selected._id : "";
    if (!devis.acteEffectues[indexActe]) {
      devis.acteEffectues[indexActe] = {
        acteId: "",
        dentIds: [],
      };
    }
    devis.acteEffectues[indexActe]["dentIds"][indexDent] = acteEffectue.dentIds;
    this.setState({ selectedDents, data: devis });
  };
  render() {
    const {
      medecins,
      nombreActes,
      nombreDentsPerActe,
      natureActes,
      filteredActeDentaires,
      selectedNatureActes,
      selectedDents,
      colors,
      selectedActes,
      dents,
      filteredPatients,
      searchQuery,
      selectedPatient,
      data,
      loading,
    } = this.state;
    let colorDents = {};
    console.log("data", data);
    console.log("medecins", medecins);
    selectedDents.map((acteDentItems, indexActeDents) => {
      for (const dentItem in acteDentItems) {
        if (acteDentItems[dentItem])
          colorDents[acteDentItems[dentItem]["numeroFDI"]] =
            colors[selectedNatureActes[indexActeDents]["nom"]];
      }
      return "";
    });

    return (
      <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
          Formulaire du devis
        </p>
        <div className="ml-2  flex justify-start">
          <button
            className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
            onClick={() => {
              this.props.history.push("/devis");
            }}
          >
            <IoChevronBackCircleSharp className="mr-1" />
            Retour à la Liste
          </button>
        </div>
        {this.props.match.params.id === "new" && (
          <div className="m-2 flex w-fit rounded-sm  bg-[#aab9d1] p-2 shadow-md ">
            <div className="mr-3 h-[40px] w-28 text-right text-xs font-bold leading-9 text-[#72757c]">
              Chercher un patient
            </div>
            <div className="flex w-fit items-start ">
              <SearchBox
                value={searchQuery}
                onChange={(e) => {
                  this.setState({
                    searchQuery: e,
                  });
                }}
              />
              <div className="flex flex-wrap">
                {filteredPatients.map((patient) => (
                  <div
                    className=" w-fit cursor-pointer  items-center justify-between pl-2  hover:bg-[#e6e2d613]"
                    key={patient._id}
                    onClick={() => {
                      this.onSelectPatient(patient);
                    }}
                  >
                    <p className=" mb-1 rounded-md bg-slate-400 p-2 text-xs font-bold leading-4">
                      {`${patient.nom} ${patient.prenom}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {Object.keys(selectedPatient).length !== 0 && (
          <>
            <div className="m-2 w-fit rounded-sm bg-slate-400 p-2">
              <p className="text-xs font-bold">{`Patient: ${selectedPatient.nom} ${selectedPatient.prenom}`}</p>
            </div>
            {this.props.match.params.id === "new" && (
              <ActesEffectuesTable
                actesEffectuees={this.state.actesEffectues}
                onSort={this.handleSort}
                sortColumn={this.state.sortColumn}
              />
            )}
            <div className="mt-2 bg-[#a2bdc5]">
              <p className="w-full bg-[#81b9ca] p-2 text-xl font-bold text-[#474a52]">
                Actes à éffectués
              </p>
              <form onSubmit={this.handleSubmit}>
                <div className="flex flex-wrap">
                  <div className="mt-3">
                    <Input
                      type="text"
                      name="nombreActe"
                      value={nombreActes}
                      label="Nombre des actes"
                      onChange={this.defineActeLines}
                      width={170}
                      height={35}
                      widthLabel={140}
                    />
                  </div>
                  <div className="mt-3">
                    {this.renderDate("dateDevi", "Date", 170, 35, 140)}
                  </div>
                  <div className="mt-3">
                    {this.renderSelect(
                      "medecinId",
                      "Medecin",
                      medecins,
                      170,
                      35,
                      140,
                    )}
                  </div>
                </div>
                <div className="m-2 flex">
                  <table className="my-0 mr-2 h-fit w-full">
                    <thead className="h-12  text-[#4f5361]">
                      <tr className="h-8 w-[100%] bg-[#869ad3] text-center">
                        {/* <th>N° Acte</th> */}
                        <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                          Nature Acte
                        </th>
                        <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                          Code Acte
                        </th>
                        <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                          Description
                        </th>
                        <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                          Nombre Dent
                        </th>
                        <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                          Dent
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {_.times(nombreActes, (indexActe) => {
                        return (
                          <tr
                            key={"acte" + indexActe}
                            className="h-12 bg-[#dedcf1] text-center"
                            style={
                              selectedNatureActes[indexActe]
                                ? {
                                    background:
                                      colors[
                                        selectedNatureActes[indexActe].nom
                                      ],
                                  }
                                : {}
                            }
                          >
                            <td>
                              <Select
                                name="natureActe"
                                options={natureActes}
                                onChange={(e) =>
                                  this.handleSelectedNature(e, indexActe)
                                }
                                width={170}
                                height={35}
                              />
                            </td>
                            <td>
                              {filteredActeDentaires[indexActe] &&
                              filteredActeDentaires[indexActe].length !== 0 ? (
                                <div className="flex w-fit flex-wrap">
                                  <select
                                    name="codeActe"
                                    id="codeActe"
                                    className=" w-24 rounded-md	border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                                    onChange={(e) =>
                                      this.handleSelectedActe(e, indexActe)
                                    }
                                    style={{
                                      height: 35,
                                    }}
                                  >
                                    <option value="" />
                                    {filteredActeDentaires[indexActe].map(
                                      (option) => {
                                        return (
                                          <option
                                            key={indexActe + option._id}
                                            value={option._id}
                                          >
                                            {option.code}
                                          </option>
                                        );
                                      },
                                    )}
                                  </select>
                                </div>
                              ) : (
                                ""
                              )}
                            </td>
                            <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                              {selectedActes[indexActe]
                                ? selectedActes[indexActe].nom
                                : ""}
                            </td>
                            <td>
                              <Input
                                type="number"
                                name="nombreDent"
                                value={
                                  nombreDentsPerActe[indexActe]
                                    ? nombreDentsPerActe[indexActe]
                                    : 0
                                }
                                onChange={(e) =>
                                  this.defineNombreDentsPerActe(e, indexActe)
                                }
                                width={60}
                                height={35}
                              />
                            </td>

                            {selectedActes[indexActe] ? (
                              <td className="item-dent">
                                {_.times(
                                  nombreDentsPerActe[indexActe],
                                  (indexDent) => {
                                    return (
                                      <div
                                        className="flex w-fit flex-wrap"
                                        key={indexActe + indexDent}
                                      >
                                        <select
                                          name="dent"
                                          key={
                                            "acte" +
                                            indexActe +
                                            "dent" +
                                            indexDent
                                          }
                                          className=" w-24 rounded-md	border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                                          onChange={(e) =>
                                            this.handleSelectedDent(
                                              e,
                                              indexActe,
                                              indexDent,
                                            )
                                          }
                                          style={{ height: 35 }}
                                        >
                                          <option value="" />
                                          {dents.map((option) => {
                                            return (
                                              <option
                                                key={
                                                  "acte" +
                                                  indexActe +
                                                  "dent" +
                                                  indexDent +
                                                  option._id
                                                }
                                                value={option._id}
                                              >
                                                {option.numeroFDI}
                                              </option>
                                            );
                                          })}
                                        </select>
                                      </div>
                                    );
                                  },
                                )}
                              </td>
                            ) : (
                              <td></td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <SchemaDent className="min-w-fit" dents={colorDents} />
                </div>
                {this.renderButton("Sauvegarder")}
              </form>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(DeviForm);
