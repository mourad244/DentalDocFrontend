import React from "react";
import Joi from "joi-browser";
import Form from "../../common/form";

import { getRegions } from "../../services/regionService";
import { getProvinces } from "../../services/provinceService";
import { getPatient, savePatient } from "../../services/patientService";
// import FichePatient from "../../documents/fichePatient";

import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";

class PatientForm extends Form {
  state = {
    data: {
      cin: "",
      historiqueMedecins: [],
      nom: "",
      prenom: "",
      isMasculin: "",
      profession: "",
      dateNaissance: "",
      telephone: "",
      ville: "",
      images: [],
      imagesDeletedIndex: [],
    },
    regions: [],
    filteredProvinces: [],
    provinces: [],
    errors: {},
    form: "patients",
    loading: false,
  };
  schema = {
    _id: Joi.string(),
    cin: Joi.string().allow("").allow(null).label("CIN"),
    nom: Joi.string().required().label("Nom"),
    prenom: Joi.string().required().label("Prenom"),
    isMasculin: Joi.boolean()
      .required() /* .allow(null) */
      .label("Genre"),
    dateNaissance: Joi.date().allow("").allow(null).label("Date Naissance"),
    telephone: Joi.string()
      .required() /* .allow("") */
      .label("profession"),
    ville: Joi.string().allow("").allow(null).label("Ville"),
    provinceId: Joi.string().allow("").allow(null).label("Province"),
    regionId: Joi.string().allow("").allow(null).label("Region"),
    // dateDerniereVisite: Joi.date().allow("").label("Date dernière visite"),
    historiqueMedecins: Joi.array().allow([]).label("Medecins"),
    images: Joi.label("Images").optional(),
    imagesDeletedIndex: Joi.label("imagesDeletedIndex").optional(),
    profession: Joi.string().allow("").label("profession"),
  };

  async populateDatas() {
    const { data: provinces } = await getProvinces();
    const { data: regions } = await getRegions();
    this.setState({ provinces, regions });
  }
  async populatePatients() {
    try {
      const patientId = this.props.match && this.props.params.id;
      const selectedPatient = this.props.selectedPatient;
      if (selectedPatient) {
        return this.setState({ data: this.mapToViewModel(selectedPatient) });
      }
      if (patientId === "new" || patientId === undefined) return;
      const { data: patient } = await getPatient(patientId);

      this.setState({ data: this.mapToViewModel(patient) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    this.setState({ loading: true });
    await this.populateDatas();
    await this.populatePatients();
    this.setState({ loading: false });
    this.props.dataIsValid(this.validate() ? false : true);
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
    // when updating the patient
    if (
      prevState.data !== this.state.data
      /*
      &&
      this.state.data._id 
       &&
      prevState.data._id */
    ) {
      const { data } = this.state;

      this.props.onPatientChange(data);
      this.props.dataIsValid(this.validate() ? false : true);
    }
    // if selectedPatient is updated
    // if (prevProps.selectedPatient !== this.props.selectedPatient) {
    //   console.log("done2");
    //   console.log("props", this.props.selectedPatient);
    //   this.setState({ data: this.mapToViewModel(this.props.selectedPatient) });
    // }
  }

  mapToViewModel(patient) {
    return {
      _id: patient._id,
      cin: patient.cin,
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
      images: patient.images ? patient.images : [],
      imagesDeletedIndex: [],
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
    const { regions, filteredProvinces, loading, data } = this.state;
    const { selectedPatient } = this.props;
    return loading ? (
      <div className="m-auto my-4">
        <ClipLoader loading={loading} size={70} />
      </div>
    ) : (
      <div className="mt-1 h-[fit-content] w-[100%] min-w-fit rounded-tr-md border border-white bg-white">
        <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
          Formulaire du patient
        </p>
        {!selectedPatient && (
          <div className="ml-2  flex justify-start">
            <button
              className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
              onClick={() => {
                this.props.history.push("/patients");
              }}
            >
              <IoChevronBackCircleSharp className="mr-1 " />
              Retour à la Liste
            </button>
          </div>
        )}
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
          {!selectedPatient && (
            <div className="mt-3">
              {this.renderDate("dateNaissance", "Date naissance")}
            </div>
          )}
          <div className="mt-3">
            {this.renderInput("telephone", "Telephone")}
          </div>
          {!selectedPatient && (
            <div className="mt-3">{this.renderInput("ville", "Ville")}</div>
          )}
          {!selectedPatient && (
            <div className="mt-3">
              {this.renderInput("profession", "Profession")}
            </div>
          )}
          <div className="mt-3">
            {this.renderSelect("regionId", "Region", regions)}
          </div>
          <div className="mt-3">
            {this.renderSelect("provinceId", "Province", filteredProvinces)}
          </div>
          {/* {this.renderInput("commentaire", "Commentaire", 360, 70)} */}
          {!selectedPatient && (
            <div className="mt-3 w-full  ">
              {this.renderUpload("image", "Photo")}
            </div>
          )}
          {!selectedPatient && (
            <div className="  mt-3 flex w-full flex-wrap">
              {data.images.length !== 0 &&
                this.renderImage("images", "Images", 200)}
            </div>
          )}
          {!selectedPatient && this.renderButton("Sauvegarder")}
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
