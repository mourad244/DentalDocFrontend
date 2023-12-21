import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveAllergie } from "../../../services/allergieService";

class AllergieForm extends Form {
  state = {
    data: {
      nom: "",
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
            err.message = "Le champ allergie est requis.";
          }
        });
        return errors;
      }),
  };

  async populateAllergies() {
    try {
      const allergie = this.props.selectedAllergie;
      if (allergie)
        this.setState({
          data: this.mapToViewModel(allergie),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateAllergies();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedAllergie && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedAllergie &&
      this.state.data._id !== this.props.selectedAllergie._id
    ) {
      await this.populateAllergies();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(allergie) {
    return {
      _id: allergie._id,
      nom: allergie.nom,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveAllergie(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de l'allergie
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Nom de l'allergie")}
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

export default AllergieForm;
