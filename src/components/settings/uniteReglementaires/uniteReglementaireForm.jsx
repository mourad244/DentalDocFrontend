import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveUniteReglementaire } from "../../../services/pharmacie/uniteReglementaireService";

class UniteReglementaireForm extends Form {
  state = {
    data: {
      nom: "",
      description: "",
      normeApplicable: "",
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
            err.message = "Le champ uniteReglementaire est requis.";
          }
        });
        return errors;
      }),
    description: Joi.string().allow(""),
    normeApplicable: Joi.string().allow(""),
  };

  async populateUniteReglementaires() {
    try {
      const uniteReglementaire = this.props.selectedUniteReglementaire;
      if (uniteReglementaire)
        this.setState({
          data: this.mapToViewModel(uniteReglementaire),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateUniteReglementaires();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedUniteReglementaire && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedUniteReglementaire &&
      this.state.data._id !== this.props.selectedUniteReglementaire._id
    ) {
      await this.populateUniteReglementaires();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(uniteReglementaire) {
    return {
      _id: uniteReglementaire._id,
      nom: uniteReglementaire.nom,
      description: uniteReglementaire.description,
      normeApplicable: uniteReglementaire.normeApplicable,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveUniteReglementaire(data);
    this.setState({ data: { nom: "", description: "", normeApplicable: "" } });
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
                  "description",
                  "Description",
                  170,
                  35,
                  "text",
                  120,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "normeApplicable",
                  "Norme Applicable",
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

export default UniteReglementaireForm;
