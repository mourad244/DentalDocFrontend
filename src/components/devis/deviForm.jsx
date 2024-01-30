import React from "react";
import { withRouter } from "react-router-dom";
import { getDents } from "../../services/dentService";
import { getPatients, getPatient } from "../../services/patientService";
import { getMedecins } from "../../services/medecinService";
import { saveDevi, getDevi } from "../../services/deviService";
import { getNatureActes } from "../../services/natureActeService";
import { getActeDentaires } from "../../services/acteDentaireService";

import Form from "../../common/form";
import Input from "../../common/input";
import Select from "../../common/select";
import SearchBox from "../../common/searchBox";
import ActesEffectuesTable from "./actesEffectuesTable";

import _ from "lodash";
import Joi from "joi-browser";
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import SchemaDent from "../../assets/icons/graphs/schemaDent";
import { colorsNatureActe } from "../../utils/colorsNatureActe";

class DeviForm extends Form {
  state = {
    data: {
      patientId: "",
      medecinId: "",
      dateDevi: new Date(),
      acteEffectues: [],
      numOrdre: "",
      rdvIds: [],
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
    loading: false,
  };
  schema = {
    _id: Joi.string(),
    patientId: Joi.string().allow("").label("Patient"),
    medecinId: Joi.string().required().label("Medecin"),
    dateDevi: Joi.date().label("Date"),
    acteEffectues: Joi.array().allow([]).label("Acte Effectues"),
    numOrdre: Joi.number().allow("").allow(null).label("Numéro d'ordre"),
    rdvIds: Joi.array().allow([]).label("Rendez-vous"),
  };
  async populateDatas() {
    this.setState({ loading: true });
    const patientId = this.props.match.params.patientid;
    const deviId = this.props.match.params.deviid;
    const rdvId = this.props.match.params.rdvid;
    if (deviId === "new" || deviId === undefined) {
      const { data: dents } = await getDents();
      const { data: patients } = await getPatients();
      const { data: medecins } = await getMedecins();
      const { data: natureActes } = await getNatureActes();
      const { data: acteDentaires } = await getActeDentaires();

      if (patientId) {
        const { data: patient } = await getPatient(patientId);
        let newData = { ...this.state.data };

        if (
          patient.deviIds !== undefined &&
          patient.deviIds !== null &&
          patient.deviIds.length !== 0
        ) {
          let newSelectedDevis = [];
          const promises = patient.deviIds.map((item) =>
            getDevi(item.deviId._id),
          );

          const devisResults = await Promise.all(promises);
          newSelectedDevis = devisResults.map(({ data: devi }) => devi);
          return this.setState({
            devis: [...newSelectedDevis],
            selectedPatient: patient,
            searchQuery: "",
            data: {
              ...newData,
              patientId: patient._id,
              rdvIds: rdvId ? [rdvId] : [],
            },
            dents,
            medecins,
            acteDentaires,
            natureActes,
          });
        } else {
          this.setState({
            selectedPatient: patient,
            searchQuery: "",
            data: {
              ...newData,
              patientId: patient._id,
              rdvIds: rdvId ? [rdvId] : [],
            },
            devis: [],
            dents,
            medecins,
            acteDentaires,
            natureActes,
          });
        }
      }
      this.setState({
        dents,
        medecins,
        acteDentaires,
        natureActes,
        patients,
      });
    } else if (deviId) {
      const { data: devi } = await getDevi(deviId);
      const { data: dents } = await getDents();
      const { data: medecins } = await getMedecins();
      const { data: natureActes } = await getNatureActes();
      const { data: acteDentaires } = await getActeDentaires();
      let selectedDents = [];
      let selectedActes = [];
      let nombreDentsPerActe = [];
      let selectedNatureActes = [];
      let filteredActeDentaires = [];

      devi.acteEffectues.map((itemActe, index) => {
        let filteredActeDentaire = {};
        let selectedNatureActe = {};
        let selectedActe = {};
        let nombreDents = 0;
        let selectedDent = {};
        //       nature Acte
        selectedNatureActe = itemActe.acteId.natureId
          ? itemActe.acteId.natureId
          : "";
        //       code acte
        selectedActe = itemActe.acteId ? itemActe.acteId : "";
        //       Num Acte
        //       dent
        nombreDents = itemActe.dentIds.length;
        itemActe.dentIds.map((e, indexDent) => {
          return (selectedDent[indexDent] = e);
        });
        filteredActeDentaire = acteDentaires.filter((e) => {
          return selectedActe
            ? e.natureId &&
                e.natureId._id.toString() === selectedNatureActe._id.toString()
            : "";
        });
        selectedDents[index] = selectedDent;
        selectedActes[index] = selectedActe;
        nombreDentsPerActe[index] = nombreDents;
        selectedNatureActes[index] = selectedNatureActe;
        filteredActeDentaires[index] = filteredActeDentaire;
        return true;
      });
      this.setState({
        data: this.mapToViewModel(devi),
        selectedPatient: devi.patientId,
        dents,
        medecins,
        acteDentaires,
        natureActes,
        nombreActes: devi.acteEffectues.length,
        filteredActeDentaires,
        selectedNatureActes,
        selectedActes,
        nombreDentsPerActe,
        selectedDents,
      });
    }
    this.setState({ loading: false });
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
        devis: [],
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
      medecinId: devi.medecinId && devi.medecinId._id ? devi.medecinId._id : "",
      dateDevi: devi.dateDevi,
      acteEffectues: devi.acteEffectues ? devi.acteEffectues : [],
      numOrdre: devi.numOrdre,
    };
  }

  doSubmit = async () => {
    let data = { ...this.state.data };
    let selectedActes = [...this.state.selectedActes];
    let montant = 0;
    data.acteEffectues.map((acteItem, index) => {
      if (acteItem.prix) {
        return (montant += acteItem.prix);
      } else if (selectedActes[index] && selectedActes[index].prix) {
        return (montant += selectedActes[index].prix);
      } else return (montant += 0);
    });
    data.montant = montant;
    await saveDevi(data);
    this.props.history.push("/devis");
  };
  defineActeLines = (e) => {
    e.preventDefault();
    this.setState({ nombreActes: e.target.value });
  };

  handleSelectedNature = (e, index) => {
    let data = { ...this.state.data };
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
    delete data.acteEffectues[index];
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
      data,
    });
    // }
  };

  handleSelectedActe = (e, index) => {
    let selectedActes = [...this.state.selectedActes];
    let selectedActe = { ...selectedActes[index] };

    const selected = this.state.acteDentaires.find(
      (item) => item._id === e.target.value,
    );

    selectedActe = selected;
    selectedActes[index] = selectedActe;

    // set data
    let devi = { ...this.state.data };
    let acteEffectue = { acteId: "", dentIds: [] };
    acteEffectue.acteId = selected ? selected._id : "";
    if (!devi.acteEffectues[index]) {
      devi.acteEffectues[index] = {
        acteId: "",
        dentIds: [],
        prix: 0,
      };
    }

    devi.acteEffectues[index]["acteId"] = acteEffectue.acteId;
    devi.acteEffectues[index]["prix"] = selected ? selected.prix : 0;
    this.setState({ selectedActes, data: devi });
  };

  defineNombreDentsPerActe = (e, indexActe) => {
    e.preventDefault();
    let nombreDentsPerActe = [...this.state.nombreDentsPerActe];
    nombreDentsPerActe[indexActe] = parseInt(e.target.value);
    this.setState({ nombreDentsPerActe });
  };

  definePrixActe = (e, indexActe) => {
    e.preventDefault();
    let data = { ...this.state.data };

    let selectedActes = [...this.state.selectedActes];
    let selectedActe = { ...selectedActes[indexActe] };
    selectedActe.prix = parseInt(e.target.value);
    selectedActes[indexActe] = selectedActe;

    data.acteEffectues[indexActe].prix = parseInt(e.target.value);
    this.setState({ data, selectedActes });
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
    let devi = { ...this.state.data };
    let acteEffectue = { acteId: "", dentIds: [] };
    acteEffectue.dentIds = selected ? selected._id : "";
    if (!devi.acteEffectues[indexActe]) {
      devi.acteEffectues[indexActe] = {
        acteId: "",
        dentIds: [],
      };
    }
    devi.acteEffectues[indexActe]["dentIds"][indexDent] = acteEffectue.dentIds;
    this.setState({ selectedDents, data: devi });
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
      loading,
      actesEffectues,
      data,
      devis,
    } = this.state;
    let colorDents = {};
    selectedDents.map((acteDentItems, indexActeDents) => {
      for (const dentItem in acteDentItems) {
        if (acteDentItems[dentItem])
          colorDents[acteDentItems[dentItem]["numeroFDI"]] =
            colors[selectedNatureActes[indexActeDents]["nom"]];
      }
      return "";
    });
    return loading ? (
      <div className="spinner">
        <ClipLoader loading={loading} size={70} />
      </div>
    ) : (
      <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
          Formulaire du devi
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
        {this.props.match.params.deviid === "new" && (
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
            {(this.props.match.params.deviid === "new" ||
              this.props.match.params.patientid) &&
              devis.length !== 0 && (
                <ActesEffectuesTable
                  actesEffectuees={actesEffectues}
                  onSort={this.handleSort}
                  sortColumn={this.state.sortColumn}
                />
              )}
            <div className="mt-2 bg-[#a2bdc5]">
              <p className="w-full bg-[#81b9ca] p-2 text-xl font-bold text-[#474a52]">
                Actes à éffectuer
              </p>
              <form onSubmit={this.handleSubmit}>
                <div className="flex flex-wrap">
                  <div className="mt-3">
                    <Input
                      type="number"
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
                    <div className=" flex w-fit flex-wrap">
                      <label
                        className="mr-3 text-right text-xs font-bold leading-9 text-[#72757c]"
                        style={{ width: 140 }}
                      >
                        Medecin
                      </label>
                      <div className="flex w-fit flex-wrap">
                        <select
                          name="medecinId"
                          id="medecinId"
                          className=" w-24 rounded-md	border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                          onChange={this.handleChange}
                          style={{
                            height: 35,
                            width: 170,
                          }}
                          value={this.state.data.medecinId}
                        >
                          <option value="" />
                          {medecins.map((option) => {
                            return (
                              <option key={option._id} value={option._id}>
                                {option.nom} {option.prenom}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="m-2 flex justify-between">
                  <table className="my-0 mr-2 h-fit w-fit">
                    <thead className="h-12  text-[#4f5361]">
                      <tr className="h-8 w-[100%] bg-[#869ad3] text-center">
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
                          Prix
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
                              <div className="m-2 flex justify-center">
                                <Select
                                  name="natureActe"
                                  options={natureActes}
                                  onChange={(e) =>
                                    this.handleSelectedNature(e, indexActe)
                                  }
                                  width={170}
                                  height={35}
                                  value={
                                    selectedNatureActes[indexActe]
                                      ? selectedNatureActes[indexActe]._id
                                      : ""
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              {filteredActeDentaires[indexActe] &&
                              filteredActeDentaires[indexActe].length !== 0 ? (
                                <div className="m-2 flex justify-center">
                                  <div className="flex w-fit flex-wrap ">
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
                                      value={
                                        selectedActes[indexActe]
                                          ? selectedActes[indexActe]._id
                                          : ""
                                      }
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
                                </div>
                              ) : (
                                <div></div>
                              )}
                            </td>
                            <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                              {selectedActes[indexActe]
                                ? selectedActes[indexActe].nom
                                : ""}
                            </td>

                            <td>
                              {selectedActes[indexActe] ? (
                                <div className="m-2 flex justify-center">
                                  <Input
                                    type="number"
                                    name="prix"
                                    value={
                                      data.acteEffectues &&
                                      data.acteEffectues[indexActe] &&
                                      data.acteEffectues[indexActe].prix
                                        ? data.acteEffectues[indexActe].prix
                                        : (selectedActes[indexActe] &&
                                            selectedActes[indexActe].prix) ||
                                          0
                                    }
                                    onChange={(e) =>
                                      this.definePrixActe(e, indexActe)
                                    }
                                    width={80}
                                    height={35}
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                            </td>
                            <td>
                              {selectedActes[indexActe] ? (
                                <div className="m-2 flex justify-center">
                                  <Input
                                    type="number"
                                    name="nombreDent"
                                    value={
                                      nombreDentsPerActe[indexActe]
                                        ? nombreDentsPerActe[indexActe]
                                        : 0
                                    }
                                    onChange={(e) =>
                                      this.defineNombreDentsPerActe(
                                        e,
                                        indexActe,
                                      )
                                    }
                                    width={60}
                                    height={35}
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                            </td>

                            {selectedActes[indexActe] ? (
                              <td>
                                {_.times(
                                  nombreDentsPerActe[indexActe],
                                  (indexDent) => {
                                    return (
                                      <div
                                        className="m-2 flex w-fit flex-wrap"
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
                                          value={
                                            selectedDents[indexActe]
                                              ? selectedDents[indexActe][
                                                  indexDent
                                                ]
                                                ? selectedDents[indexActe][
                                                    indexDent
                                                  ]._id
                                                : ""
                                              : ""
                                          }
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
