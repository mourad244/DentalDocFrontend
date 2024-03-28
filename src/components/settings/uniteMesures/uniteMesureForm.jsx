import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveUniteMesure } from "../../../services/pharmacie/uniteMesureService";

class UniteMesureForm extends Form {
  state = {
    data: {
      nom: "",
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
            err.message = "Le champ uniteMesure est requis.";
          }
        });
        return errors;
      }),
    description: Joi.string().allow(""),
  };

  async populateUniteMesures() {
    try {
      const uniteMesure = this.props.selectedUniteMesure;
      if (uniteMesure)
        this.setState({
          data: this.mapToViewModel(uniteMesure),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateUniteMesures();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedUniteMesure && prevState.data._id) {
      this.setState({ data: { nom: "", description: "" } });
    }
    if (
      this.props.selectedUniteMesure &&
      this.state.data._id !== this.props.selectedUniteMesure._id
    ) {
      await this.populateUniteMesures();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(uniteMesure) {
    return {
      _id: uniteMesure._id,
      nom: uniteMesure.nom,
      description: uniteMesure.description,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveUniteMesure(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de l'unité de mesure
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              <div className="mt-3">
                {this.renderInput(
                  "nom",
                  "Nom unite mesure",
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

export default UniteMesureForm;
