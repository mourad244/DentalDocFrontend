import React from "react";
import Joi from "joi-browser";
import Form from "../../common/form";

import { getRegions } from "../../services/regionService";
import { getMedecins } from "../../services/medecinService";
import { getProvinces } from "../../services/provinceService";
import { getPatient, savePatient } from "../../services/patientService";
// import FichePatient from "../../documents/fichePatient";
import { IoChevronBackCircleSharp } from "react-icons/io5";

class PatientForm extends Form {
  state = {
    data: {
      cin: "",
      dateCreation: "",
      // medecinId: "",
      historiqueMedecins: [],
      nom: "",
      prenom: "",
      isMasculin: "",
      profession: "",
      dateNaissance: "",
      telephone: "",
      ville: "",
    },
    regions: [],
    filteredProvinces: [],
    provinces: [],
    errors: {},
    medecins: [],
    form: "patients",
  };
  schema = {
    _id: Joi.string(),
    cin: Joi.string().allow("").allow(null).label("CIN"),
    nom: Joi.string().required().label("Nom"),
    prenom: Joi.string().required().label("Prenom"),
    isMasculin: Joi.boolean().allow(null).label("Genre"),
    dateNaissance: Joi.date().allow("").allow(null).label("Date Naissance"),
    telephone: Joi.string().allow("").label("profession"),
    ville: Joi.string().allow("").allow(null).label("Ville"),
    dateCreation: Joi.date().allow(null).label("Date Ouverture"),
    provinceId: Joi.string().allow("").allow(null).label("Province"),
    regionId: Joi.string().allow("").allow(null).label("Region"),
    // dateDerniereVisite: Joi.date().allow("").label("Date dernière visite"),
    // medecinId: Joi.string().allow("").label("Medecin"),
    historiqueMedecins: Joi.array().allow([]).label("Medecins"),
    profession: Joi.string().allow("").label("profession"),
  };

  async populateMedecins() {
    const { data: medecins } = await getMedecins();
    this.setState({ medecins });
  }

  async populateDatas() {
    const { data: provinces } = await getProvinces();
    const { data: regions } = await getRegions();
    this.setState({ provinces, regions });
  }
  async populatePatients() {
    try {
      const patientId = this.props.match.params.id;
      if (patientId === "new" || patientId === undefined) return;
      const { data: patient } = await getPatient(patientId);

      this.setState({ data: this.mapToViewModel(patient) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateMedecins();
    await this.populateDatas();
    await this.populatePatients();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
    if (prevState.data.regionId !== this.state.data.regionId) {
      this.setState({
        filteredProvinces: this.state.provinces.filter(
          (province) => province.regionId._id === this.state.data.regionId,
        ),
      });
    }
  }

  mapToViewModel(patient) {
    return {
      _id: patient._id,
      cin: patient.cin,
      dateCreation: patient.dateCreation,
      // medecinId: patient.medecinId ? patient.medecinId._id : undefined,
      historiqueMedecins: patient.historiqueMedecins,
      nom: patient.nom,
      prenom: patient.prenom,
      isMasculin: patient.isMasculin,
      profession: patient.profession,
      dateNaissance: patient.dateNaissance,
      telephone: patient.telephone,
      ville: patient.ville,
      provinceId: patient.provinceId ? patient.provinceId : "",
      regionId: patient.regionId ? patient.regionId : "",
      // dateDerniereVisite: patient.dateDerniereVisite,
    };
  }

  doSubmit = async () => {
    let result = { ...this.state.data };
    await savePatient(result);
    if (this.props.match) this.props.history.push("/patients");
    else window.location.reload();
  };

  render() {
    // let patientId = "";
    // if (
    //   this.props.match &&
    //   this.props.match.params &&
    //   this.props.match.params.id
    // )
    //   patientId = this.props.match.params.id;
    const { regions, filteredProvinces } = this.state;
    return (
      <div className="mt-1 h-[fit-content] w-[100%] min-w-fit rounded-tr-md border border-white bg-white">
        <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
          Formulaire du patient
        </p>
        <div className="ml-2  flex justify-start">
          <button
            className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
            onClick={() => {
              this.props.history.push("/patients");
            }}
          >
            <IoChevronBackCircleSharp className="mr-1 " />
            Retour à la Liste
          </button>
        </div>
        <form
          className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
          onSubmit={this.handleSubmit}
        >
          <div className="mt-3">{this.renderInput("cin", "CIN")}</div>
          <div className="mt-3">{this.renderInput("nom", "Nom")}</div>
          <div className="mt-3">{this.renderInput("prenom", "Prenom")}</div>
          <div className="mt-3">
            {this.renderBoolean("isMasculin", "Genre", "Masculin", "Féminin")}
          </div>
          <div className="mt-3">
            {this.renderDate("dateNaissance", "Date naissance")}
          </div>
          <div className="mt-3">
            {this.renderInput("telephone", "Telephone")}
          </div>
          <div className="mt-3">{this.renderInput("ville", "Ville")}</div>
          <div className="mt-3">
            {this.renderInput("profession", "Profession")}
          </div>
          <div className="mt-3">
            {this.renderSelect("regionId", "Region", regions)}
          </div>
          <div className="mt-3">
            {this.renderSelect("provinceId", "Province", filteredProvinces)}
          </div>
          <div className="mt-3">
            {this.renderDate("dateCreation", "Date ouverture")}
          </div>
          {this.renderButton("Sauvegarder")}
        </form>
        {/* {patientId ? (
          <FichePatient
            data={{
              ...this.state.data,
            }}
            document={<FichePatient />}
          />
        ) : (
          ""
        )} */}
      </div>
    );
  }
}

export default PatientForm;
