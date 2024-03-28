import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveSociete } from "../../../services/pharmacie/societeService";
/* 
 nom: {
    type: String,
    required: true,
  },
  telephone: String,
  adresse: String,
  ville: String,
  banque: String,
  lieuOuvertureBanque: String,
  RIB: String,
  numPatente: String,
  numRC: String,
  numIF: String,
  numCNSS: String,
  numICE: String,
  email: String,
  fax: String,
  site: String,
  taxPro: String,
  description: String,
*/
class SocieteForm extends Form {
  state = {
    data: {
      nom: "",
      telephone: "",
      adresse: "",
      ville: "",
      banque: "",
      lieuOuvertureBanque: "",
      RIB: "",
      numPatente: "",
      numRC: "",
      numIF: "",
      numCNSS: "",
      numICE: "",
      email: "",
      fax: "",
      site: "",
      taxPro: "",
      description: "",
    },
    formDisplay: false,
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    nom: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ societe est requis.";
          }
        });
        return errors;
      }),
    telephone: Joi.string().allow(""),
    adresse: Joi.string().allow(""),
    ville: Joi.string().allow(""),
    banque: Joi.string().allow(""),
    lieuOuvertureBanque: Joi.string().allow(""),
    RIB: Joi.string().allow(""),
    numPatente: Joi.string().allow(""),
    numRC: Joi.string().allow(""),
    numIF: Joi.string().allow(""),
    numCNSS: Joi.string().allow(""),
    numICE: Joi.string().allow(""),
    email: Joi.string().allow(""),
    fax: Joi.string().allow(""),
    site: Joi.string().allow(""),
    taxPro: Joi.string().allow(""),
    description: Joi.string().allow(""),
  };

  async populateSocietes() {
    try {
      const societe = this.props.selectedSociete;
      if (societe)
        this.setState({
          data: this.mapToViewModel(societe),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateSocietes();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedSociete && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedSociete &&
      this.state.data._id !== this.props.selectedSociete._id
    ) {
      await this.populateSocietes();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(societe) {
    return {
      _id: societe._id,
      nom: societe.nom,
      telephone: societe.telephone,
      adresse: societe.adresse,
      ville: societe.ville,
      banque: societe.banque,
      lieuOuvertureBanque: societe.lieuOuvertureBanque,
      RIB: societe.RIB,
      numPatente: societe.numPatente,
      numRC: societe.numRC,
      numIF: societe.numIF,
      numCNSS: societe.numCNSS,
      numICE: societe.numICE,
      email: societe.email,
      fax: societe.fax,
      site: societe.site,
      taxPro: societe.taxPro,
      description: societe.description,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveSociete(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de l'unité reglementaire
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              <div className="mt-3">
                {this.renderInput("nom", "Nom", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "telephone",
                  "Téléphone",
                  170,
                  35,
                  "text",
                  120,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput("adresse", "Adresse", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput("ville", "Ville", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput("banque", "Banque", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "lieuOuvertureBanque",
                  "Lieu d'ouverture de la banque",
                  170,
                  35,
                  "text",
                  120,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput("RIB", "RIB", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "numPatente",
                  "Numéro de patente",
                  170,
                  35,
                  "text",
                  120,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "numRC",
                  "Numéro de RC",
                  170,
                  35,
                  "text",
                  120,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput("numIF", "Numéro IF", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "numCNSS",
                  "Numéro CNSS",
                  170,
                  35,
                  "text",
                  120,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput("numICE", "Numéro ICE", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput("email", "Email", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput("fax", "Fax", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput("site", "Site", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "taxPro",
                  "Taxe professionnelle",
                  170,
                  35,
                  "text",
                  120,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "description",
                  "Description",
                  170,
                  35,
                  "text",
                  120,
                )}
              </div>

              {this.renderButton("Sauvegarder")}
            </form>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
}

export default SocieteForm;
