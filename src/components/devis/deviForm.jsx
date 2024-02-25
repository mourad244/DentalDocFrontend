import React from "react";
import { withRouter } from "react-router-dom";

import { getRdv } from "../../services/rdvService";
import { getDents } from "../../services/dentService";
import { getPatient } from "../../services/patientService";
import { getMedecins } from "../../services/medecinService";
import { saveDevi, getDevi } from "../../services/deviService";
import { getNatureActes } from "../../services/natureActeService";
import { getActeDentaires } from "../../services/acteDentaireService";

import Form from "../../common/form";
import SearchPatient from "../../common/searchPatient";
import ActesEffectuesTable from "./actesEffectuesTable";

import Input from "../../common/input";
import Select from "../../common/select";

import _ from "lodash";
import axios from "axios";
import Joi from "joi-browser";
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { jsonToFormData } from "../../utils/jsonToFormData";
import SchemaDent from "../../assets/icons/graphs/schemaDent";
import { colorsNatureActe } from "../../utils/colorsNatureActe";
import PatientForm from "../patients/patientForm";

class DeviForm extends Form {
  state = {
    data: {
      rdvIds: [],
      images: [],
      numOrdre: "",
      patientId: "",
      medecinId: "",
      acteEffectues: [],
      dateDevi: new Date(),
      imagesDeletedIndex: [],
    },
    dents: [],
    devis: [],
    errors: {},
    medecins: [],
    form: "devis",
    loading: false,
    nombreActes: 1,
    natureActes: [],
    acteDentaires: [],
    sortColumn: { path: "date", order: "desc" },
    selecteDDents: [],
    selecteDActes: [],
    actesEffectues: [],
    selecteDPatient: {},
    loadingPatient: false,
    nombreDentsPerActe: [],
    selecteDNatureActes: [],
    colors: colorsNatureActe,
    filteredActeDentaires: [],
    patientDataIsValid: false,
  };
  schema = {
    _id: Joi.string(),
    dateDevi: Joi.date().label("Date"),
    images: Joi.label("Images").optional(),
    rdvIds: Joi.array().allow([]).label("Rendez-vous"),
    patientId: Joi.string().allow("").label("Patient"),
    medecinId: Joi.string().required().label("Medecin"),
    acteEffectues: Joi.array().allow([]).label("Acte Effectues"),
    imagesDeletedIndex: Joi.label("imagesDeletedIndex").optional(),
    numOrdre: Joi.number().allow("").allow(null).label("Numéro d'ordre"),
  };
  async populateDatas() {
    this.setState({ loading: true });
    const patientId = this.props.match.params.patientid;
    const deviId = this.props.match.params.deviid;
    const rdvId = this.props.match.params.rdvid;
    if (deviId === "new" || deviId === undefined) {
      let rdvDate = new Date();
      if (rdvId) {
        const { data: rdv } = await getRdv(rdvId);
        rdvDate = rdv.datePrevu;
      }
      const { data: dents } = await getDents();
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
          let newSelecteDDevis = [];
          const promises = patient.deviIds.map((item) =>
            getDevi(item.deviId._id),
          );

          const devisResults = await Promise.all(promises);
          newSelecteDDevis = devisResults.map(({ data: devi }) => devi);
          this.setState({
            devis: [...newSelecteDDevis],
            selecteDPatient: patient,
            searchQuery: "",
            data: {
              ...newData,
              patientId: patient._id,
              rdvIds: rdvId ? [rdvId] : [],
              dateDevi: rdvDate,
            },
            dents,
            medecins,
            acteDentaires,
            natureActes,
          });
        } else {
          this.setState({
            selecteDPatient: patient,
            searchQuery: "",
            data: {
              ...newData,
              patientId: patient._id,
              rdvIds: rdvId ? [rdvId] : [],
              dateDevi: rdvDate,
            },
            devis: [],
            dents,
            medecins,
            acteDentaires,
            natureActes,
          });
        }
      } else {
        this.setState({
          dents,
          medecins,
          acteDentaires,
          natureActes,
        });
      }
    } else if (deviId) {
      const { data: devi } = await getDevi(deviId);
      const { data: dents } = await getDents();
      const { data: medecins } = await getMedecins();
      const { data: natureActes } = await getNatureActes();
      const { data: acteDentaires } = await getActeDentaires();
      let selecteDDents = [];
      let selecteDActes = [];
      let nombreDentsPerActe = [];
      let selecteDNatureActes = [];
      let filteredActeDentaires = [];

      devi.acteEffectues.map((itemActe, index) => {
        let filteredActeDentaire = {};
        let selecteDNatureActe = {};
        let selecteDActe = {};
        let nombreDents = 0;
        let selecteDDent = {};
        //       nature Acte
        selecteDNatureActe = itemActe.acteId.natureId
          ? itemActe.acteId.natureId
          : "";
        //       code acte
        selecteDActe = itemActe.acteId ? itemActe.acteId : "";
        //       Num Acte
        //       dent
        nombreDents = itemActe.dentIds.length;
        itemActe.dentIds.map((e, indexDent) => {
          return (selecteDDent[indexDent] = e);
        });
        filteredActeDentaire = acteDentaires.filter((e) => {
          return selecteDActe
            ? e.natureId &&
                e.natureId._id.toString() === selecteDNatureActe._id.toString()
            : "";
        });
        selecteDDents[index] = selecteDDent;
        selecteDActes[index] = selecteDActe;
        nombreDentsPerActe[index] = nombreDents;
        selecteDNatureActes[index] = selecteDNatureActe;
        filteredActeDentaires[index] = filteredActeDentaire;
        return true;
      });
      this.setState({
        data: this.mapToViewModel(devi),
        selecteDPatient: devi.patientId,
        dents,
        medecins,
        acteDentaires,
        natureActes,
        nombreActes: devi.acteEffectues.length,
        filteredActeDentaires,
        selecteDNatureActes,
        selecteDActes,
        nombreDentsPerActe,
        selecteDDents,
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
    if (
      fetchedPatient.deviIds !== undefined &&
      fetchedPatient.deviIds !== null &&
      fetchedPatient.deviIds.length !== 0
    ) {
      let newSelecteDDevis = [];
      const promises = fetchedPatient.deviIds.map((item) =>
        getDevi(item.deviId._id),
      );

      const devisResults = await Promise.all(promises);
      newSelecteDDevis = devisResults.map(({ data: devi }) => devi);
      return this.setState({
        devis: [...newSelecteDDevis],
        selecteDPatient: fetchedPatient,
        searchQuery: "",
        data: {
          ...data,
          patientId: fetchedPatient._id,
        },
        loadingPatient: false,
      });
    } else
      this.setState({
        selecteDPatient: fetchedPatient,
        searchQuery: "",
        data: {
          ...data,
          patientId: fetchedPatient._id,
        },
        devis: [],
        loadingPatient: false,
      });
  };

  async componentDidMount() {
    await this.populateDatas();
  }

  async componentDidUpdate(prevProps, prevState) {
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
            acte.date = itemDevi.dateDevi;
            acte.medecin = `${itemDevi.medecinId.nom} ${
              itemDevi.medecinId.prenom ? itemDevi.medecinId.prenom : ""
            } `;
            acte.nature = itemActe.acteId.natureId
              ? itemActe.acteId.natureId.nom
              : "";
            acte.code = itemActe.acteId.code;
            acte.nom = itemActe.acteId.nom;
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
    if (prevState.nombreActes !== this.state.nombreActes) {
      let selecteDNatureActes = [...this.state.selecteDNatureActes];
      let selecteDActes = [...this.state.selecteDActes];
      let nombreDentsPerActe = [...this.state.nombreDentsPerActe];
      let selecteDDents = [...this.state.selecteDDents];
      let filteredActeDentaires = [...this.state.filteredActeDentaires];
      let data = { ...this.state.data };
      let acteEffectues = [...this.state.data.acteEffectues];
      if (prevState.nombreActes > this.state.nombreActes) {
        selecteDNatureActes.splice(
          this.state.nombreActes,
          prevState.nombreActes - this.state.nombreActes,
        );
        selecteDActes.splice(
          this.state.nombreActes,
          prevState.nombreActes - this.state.nombreActes,
        );
        nombreDentsPerActe.splice(
          this.state.nombreActes,
          prevState.nombreActes - this.state.nombreActes,
        );
        selecteDDents.splice(
          this.state.nombreActes,
          prevState.nombreActes - this.state.nombreActes,
        );
        filteredActeDentaires.splice(
          this.state.nombreActes,
          prevState.nombreActes - this.state.nombreActes,
        );
        acteEffectues.splice(
          this.state.nombreActes,
          prevState.nombreActes - this.state.nombreActes,
        );
      }
      data.acteEffectues = acteEffectues;
      this.setState({
        selecteDNatureActes,
        selecteDActes,
        nombreDentsPerActe,
        selecteDDents,
        filteredActeDentaires,
        data,
        nombreActes: this.state.nombreActes,
      });
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
      images: devi.images ? devi.images : [],
      imagesDeletedIndex: [],
    };
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });
    const sendFile = this.state.sendFile;
    if (sendFile) {
      return this.fileUploadHandler();
    }
    if (errors) return;
    this.doSubmit();
  };
  fileUploadHandler = async () => {
    let fd = new FormData();
    const form = this.state.form;
    let data = { ...this.state.data };
    let selecteDActes = [...this.state.selecteDActes];

    let montant = 0;
    data.acteEffectues.map((acteItem, index) => {
      if (acteItem.prix) {
        return (montant += acteItem.prix);
      } else if (selecteDActes[index] && selecteDActes[index].prix) {
        return (montant += selecteDActes[index].prix);
      } else return (montant += 0);
    });
    delete data._id;
    delete data.images;
    fd = jsonToFormData(data);
    for (const item in this.state) {
      if (item.includes("selected")) {
        let filename = item.replace("selected", "");
        for (let i = 0; i < this.state[item][0].length; i++) {
          fd.append(
            filename,
            this.state[item][0][i],
            this.state[item][0][i].name,
          );
        }
      }
    }
    fd.append("montant", montant);
    this.props.match !== undefined &&
    this.props.match.params.deviid &&
    this.props.match.params.deviid !== "new"
      ? await axios.put(
          `${process.env.REACT_APP_API_URL}/${form}/${this.props.match.params.deviid}`,
          fd,
        )
      : await axios.post(`${process.env.REACT_APP_API_URL}/${form}`, fd);
    if (this.props.match) this.props.history.push(`/${form}`);
    else {
      window.location.reload();
    }
  };
  doSubmit = async () => {
    let data = { ...this.state.data };
    let selecteDActes = [...this.state.selecteDActes];
    let montant = 0;
    data.acteEffectues.map((acteItem, index) => {
      if (acteItem.prix) {
        return (montant += acteItem.prix);
      } else if (selecteDActes[index] && selecteDActes[index].prix) {
        return (montant += selecteDActes[index].prix);
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

  handleSelecteDNature = (e, index) => {
    let data = { ...this.state.data };
    let selecteDNatureActes = [...this.state.selecteDNatureActes];
    let filteredActeDentaires = [...this.state.filteredActeDentaires];
    let selecteDActes = [...this.state.selecteDActes];
    let nombreDentsPerActe = [...this.state.nombreDentsPerActe];
    let selecteDDents = [...this.state.selecteDDents];

    let selecteDNatureActe = { ...selecteDNatureActes[index] };
    const selecteD = this.state.natureActes.find(
      (item) => item._id === e.target.value,
    );
    selecteDNatureActe = selecteD;
    selecteDNatureActes[index] = selecteDNatureActe;

    let filteredActeDentaire = { ...filteredActeDentaires[index] };
    filteredActeDentaire = this.state.acteDentaires.filter((e) => {
      return selecteD ? e.natureId && e.natureId._id === selecteD._id : "";
    });
    filteredActeDentaires[index] = filteredActeDentaire;

    delete selecteDActes[index];
    delete data.acteEffectues[index];
    nombreDentsPerActe[index] = 0;
    delete selecteDDents[index];
    this.setState({
      filteredActeDentaires,
      selecteDNatureActes,
      selecteDActes,
      nombreDentsPerActe,
      selecteDDents,
      data,
    });
  };

  handleSelecteDActe = (e, index) => {
    let selecteDActes = [...this.state.selecteDActes];
    let selecteDActe = { ...selecteDActes[index] };
    const selecteD = this.state.acteDentaires.find(
      (item) => item._id === e.target.value,
    );

    selecteDActe = selecteD;
    selecteDActes[index] = selecteDActe;

    let devi = { ...this.state.data };
    let acteEffectue = { acteId: "", dentIds: [] };
    acteEffectue.acteId = selecteD ? selecteD._id : "";
    if (!devi.acteEffectues[index]) {
      devi.acteEffectues[index] = {
        acteId: "",
        dentIds: [],
        prix: 0,
      };
    }

    devi.acteEffectues[index]["acteId"] = acteEffectue.acteId;
    devi.acteEffectues[index]["prix"] = selecteD ? selecteD.prix : 0;
    this.setState({ selecteDActes, data: devi });
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

    let selecteDActes = [...this.state.selecteDActes];
    let selecteDActe = { ...selecteDActes[indexActe] };
    selecteDActe.prix = parseInt(e.target.value);
    selecteDActes[indexActe] = selecteDActe;

    data.acteEffectues[indexActe].prix = parseInt(e.target.value);
    this.setState({ data, selecteDActes });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSelecteDDent = (e, indexActe, indexDent) => {
    let selecteDDents = [...this.state.selecteDDents];
    let selecteDDent = { ...selecteDDents[indexActe] };
    const selecteD = this.state.dents.find(
      (item) => item._id === e.target.value,
    );
    selecteDDent[indexDent] = selecteD;
    selecteDDents[indexActe] = selecteDDent;
    let devi = { ...this.state.data };
    let acteEffectue = { acteId: "", dentIds: [] };
    acteEffectue.dentIds = selecteD ? selecteD._id : "";
    if (!devi.acteEffectues[indexActe]) {
      devi.acteEffectues[indexActe] = {
        acteId: "",
        dentIds: [],
      };
    }
    devi.acteEffectues[indexActe]["dentIds"][indexDent] = acteEffectue.dentIds;
    this.setState({ selecteDDents, data: devi });
  };
  render() {
    const {
      data,
      devis,
      dents,
      colors,
      loading,
      medecins,
      natureActes,
      nombreActes,
      selecteDDents,
      selecteDActes,
      actesEffectues,
      loadingPatient,
      selecteDPatient,
      nombreDentsPerActe,
      selecteDNatureActes,
      filteredActeDentaires,
      patientDataIsValid,
    } = this.state;
    const rdvId = this.props.match.params.rdvid;
    const deviId = this.props.match.params.deviid;
    const patientId = this.props.match.params.patientid;
    let colorDents = {};
    selecteDDents.map((acteDentItems, indexActeDents) => {
      for (const dentItem in acteDentItems) {
        if (acteDentItems[dentItem])
          colorDents[acteDentItems[dentItem]["numeroFDI"]] =
            colors[selecteDNatureActes[indexActeDents]["nom"]];
      }
      return "";
    });
    return (
      <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
          Formulaire du devi
        </p>
        <div className="ml-2  flex justify-start">
          <button
            className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
            onClick={() => {
              this.props.history.push("/devis");
            }}
          >
            <IoChevronBackCircleSharp className="mr-1" />
            Retour à la Liste
          </button>
        </div>
        {deviId === "new" && !patientId && !rdvId && !selecteDPatient._id && (
          <SearchPatient onPatientSelect={this.onSelectPatient} />
        )}
        <div className="m-2 flex flex-col bg-[#adced8]">
          {selecteDPatient &&
          Object.keys(selecteDPatient).length !== 0 &&
          selecteDPatient._id ? (
            <div className="flex w-full flex-row rounded-sm bg-[#4F6874] p-2">
              <div className="m-auto w-auto">
                <p className="text-center text-base font-bold text-white">
                  {`${
                    selecteDPatient.nom && selecteDPatient.nom.toUpperCase()
                  } ${
                    selecteDPatient.prenom &&
                    selecteDPatient.prenom.toUpperCase()
                  }`}
                </p>
              </div>
              {deviId === "new" && !rdvId && (
                <button
                  className="h-6 w-6 rounded-md bg-red-400 p-1 font-bold leading-4 text-white"
                  onClick={() => {
                    this.setState({
                      selecteDPatient: {},
                      patientDataIsValid: false,
                    });
                  }}
                >
                  x
                </button>
              )}
            </div>
          ) : (
            loadingPatient && (
              <div className="m-auto my-4">
                <ClipLoader loading={loadingPatient} size={50} />
              </div>
            )
          )}
          {!loadingPatient ? (
            <div className="w-[90%]">
              <PatientForm
                selectedPatient={selecteDPatient}
                onPatientChange={(patient) => {
                  this.setState({ selecteDPatient: patient });
                }}
                dataIsValid={(patientDataIsValid) => {
                  this.setState({ patientDataIsValid });
                }}
                isRdvForm={true}
              />
            </div>
          ) : (
            <div className="m-auto my-4">
              <ClipLoader loading={loadingPatient} size={50} />
            </div>
          )}
        </div>
        {console.log("loadingPatient", loadingPatient)}
        {console.log("loading", loading)}
        {console.log("selecteDPatient", selecteDPatient)}
        {console.log("patientDataIsValid", patientDataIsValid)}

        {!loadingPatient &&
        !loading &&
        selecteDPatient &&
        Object.keys(selecteDPatient).length !== 0 &&
        patientDataIsValid ? (
          <>
            {(deviId === "new" || patientId) && devis.length !== 0 && (
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
              <form>
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
                          className=" w-24 rounded-md	border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
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
                  <div className="mt-3 w-full  ">
                    {this.renderUpload("image", "Photo radio", "file", 140)}
                  </div>

                  <div className="  mt-3 flex w-full flex-wrap">
                    {data.images.length !== 0 &&
                      this.renderImage("images", "Images", 200)}
                  </div>
                </div>
                <div className="m-2 flex justify-between">
                  <table className="my-0 mr-2 h-fit w-fit">
                    <thead className="h-12  text-[#4f5361]">
                      <tr className="h-8 w-[100%] bg-[#D6E1E3] text-center">
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
                            className="h-12 bg-[#D6E1E3] text-center"
                            style={
                              selecteDNatureActes[indexActe]
                                ? {
                                    background:
                                      colors[
                                        selecteDNatureActes[indexActe].nom
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
                                    this.handleSelecteDNature(e, indexActe)
                                  }
                                  width={170}
                                  height={35}
                                  value={
                                    selecteDNatureActes[indexActe]
                                      ? selecteDNatureActes[indexActe]._id
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
                                      className=" w-24 rounded-md	border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                                      onChange={(e) =>
                                        this.handleSelecteDActe(e, indexActe)
                                      }
                                      style={{
                                        height: 35,
                                      }}
                                      value={
                                        selecteDActes[indexActe]
                                          ? selecteDActes[indexActe]._id
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
                                <div />
                              )}
                            </td>
                            <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                              {selecteDActes[indexActe]
                                ? selecteDActes[indexActe].nom
                                : ""}
                            </td>
                            <td>
                              {selecteDActes[indexActe] ? (
                                <div className="m-2 flex justify-center">
                                  <Input
                                    type="number"
                                    name="prix"
                                    value={
                                      data.acteEffectues &&
                                      data.acteEffectues[indexActe] &&
                                      data.acteEffectues[indexActe].prix
                                        ? data.acteEffectues[indexActe].prix
                                        : (selecteDActes[indexActe] &&
                                            selecteDActes[indexActe].prix) ||
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
                              {selecteDActes[indexActe] ? (
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
                            {selecteDActes[indexActe] ? (
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
                                          className=" w-24 rounded-md	border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                                          onChange={(e) =>
                                            this.handleSelecteDDent(
                                              e,
                                              indexActe,
                                              indexDent,
                                            )
                                          }
                                          style={{ height: 35 }}
                                          value={
                                            selecteDDents[indexActe]
                                              ? selecteDDents[indexActe][
                                                  indexDent
                                                ]
                                                ? selecteDDents[indexActe][
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
                <div className="mr-6 mt-3 flex w-full justify-end">
                  <button
                    onClick={this.handleSubmit}
                    className={
                      !this.validate()
                        ? "cursor-pointer rounded-5px border-0   bg-custom-blue pl-3 pr-3 text-xs font-medium leading-7 text-white shadow-custom "
                        : "pointer-events-none cursor-not-allowed rounded-5px   border border-blue-40 bg-grey-ea pl-3 pr-3 text-xs leading-7 text-grey-c0"
                    }
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="m-auto my-4">
            <ClipLoader loading={loadingPatient} size={70} />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(DeviForm);
