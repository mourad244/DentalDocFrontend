import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveMedecin } from "../../../services/medecinService";

class MedecinForm extends Form {
  state = {
    data: {
      nom: "",
      prenom: "",
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
            err.message = "Le champ medecin est requis.";
          }
        });
        return errors;
      }),
    prenom: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ prenom est requis.";
          }
        });
        return errors;
      }),
  };

  async populateMedecins() {
    try {
      const medecin = this.props.selectedMedecin;
      if (medecin)
        this.setState({
          data: this.mapToViewModel(medecin),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateMedecins();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedMedecin && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedMedecin &&
      this.state.data._id !== this.props.selectedMedecin._id
    ) {
      await this.populateMedecins();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(medecin) {
    return {
      _id: medecin._id,
      nom: medecin.nom,
      prenom: medecin.prenom,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveMedecin(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire du medecin
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Nom")}
              {this.renderInput("prenom", "Prenom")}
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

export default MedecinForm;
