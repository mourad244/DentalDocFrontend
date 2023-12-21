import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveCategorieMedicament } from "../../../services/categorieMedicamentService";

class CategorieMedicamentForm extends Form {
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
            err.message = "Le champ categorieMedicament est requis.";
          }
        });
        return errors;
      }),
  };

  async populateCategorieMedicaments() {
    try {
      const categorieMedicament = this.props.selectedCategorieMedicament;
      if (categorieMedicament)
        this.setState({
          data: this.mapToViewModel(categorieMedicament),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateCategorieMedicaments();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedCategorieMedicament && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedCategorieMedicament &&
      this.state.data._id !== this.props.selectedCategorieMedicament._id
    ) {
      await this.populateCategorieMedicaments();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(categorieMedicament) {
    return {
      _id: categorieMedicament._id,
      nom: categorieMedicament.nom,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveCategorieMedicament(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de la categorie du medicament
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Categorie Medicament")}
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

export default CategorieMedicamentForm;
