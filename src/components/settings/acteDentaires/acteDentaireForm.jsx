import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveActeDentaire } from "../../../services/acteDentaireService";
import _ from "lodash";

class ActeDentaireForm extends Form {
  state = {
    data: {
      nom: "",
      natureId: "",
      code: "",
      prix: "",
      duree: "",
      moments: [],
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
            err.message = "Le champ acte dentaire est requis.";
          }
        });
        return errors;
      }),
    natureId: Joi.string().allow(""),
    code: Joi.number().allow(""),
    prix: Joi.number().allow(""),
    duree: Joi.number().allow(""),
    moments: Joi.array().allow(""),
  };

  async populateActeDentaires() {
    try {
      const acteDentaire = this.props.selectedActeDentaire;
      if (acteDentaire)
        this.setState({
          data: this.mapToViewModel(acteDentaire),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateActeDentaires();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedActeDentaire && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedActeDentaire &&
      this.state.data._id !== this.props.selectedActeDentaire._id
    ) {
      await this.populateActeDentaires();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(acteDentaire) {
    return {
      _id: acteDentaire._id,
      nom: acteDentaire.nom,
      natureId: acteDentaire.natureId ? acteDentaire.natureId._id : "",
      code: acteDentaire.code,
      prix: acteDentaire.prix,
      duree: acteDentaire.duree,
      moments: acteDentaire.moments ? acteDentaire.moments : [],
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveActeDentaire(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire detail nature acte
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              <div className="mt-3">{this.renderInput("nom", "Nom acte")}</div>
              <div className="mt-3">
                {this.renderSelect(
                  "natureId",
                  "Nature acte",
                  this.props.natureActes,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput("code", "Code", 170, 35, "number")}
              </div>
              <div className="mt-3">
                {this.renderInput("prix", "Prix", 170, 35, "number")}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "duree",
                  "Duree en minutes",
                  170,
                  35,
                  "number",
                )}
              </div>
              {this.renderCheckboxes(
                "moments",
                "Temps préféré",
                200,
                96,
                ["matin", "apres-midi", "soir"],
                ["Matin", "Après-midi", "Soir"],
              )}

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

export default ActeDentaireForm;

// nom: acteDentaire.nom,
// natureId: acteDentaire.natureId,
