import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveMedicament } from "../../../services/medicamentService";

class MedicamentForm extends Form {
  state = {
    data: {
      nom: "",
      description: "",
      categorieId: "",
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
            err.message = "Le champ medicament est requis.";
          }
        });
        return errors;
      }),
    description: Joi.string(),
    categorieId: Joi.string().allow(""),
  };

  async populateMedicaments() {
    try {
      const medicament = this.props.selectedMedicament;
      if (medicament)
        this.setState({
          data: this.mapToViewModel(medicament),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateMedicaments();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedMedicament && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedMedicament &&
      this.state.data._id !== this.props.selectedMedicament._id
    ) {
      await this.populateMedicaments();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(medicament) {
    return {
      _id: medicament._id,
      nom: medicament.nom,
      description: medicament.description,
      categorieId: medicament.categorieId ? medicament.categorieId._id : "",
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveMedicament(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire du medicament
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Nom médicament")}
              {this.renderSelect(
                "categorieId",
                "Categorie",
                this.props.categorieMedicaments,
              )}
              {this.renderInput("description", "Description")}
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

export default MedicamentForm;
