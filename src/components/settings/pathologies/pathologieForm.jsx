import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { savePathologie } from "../../../services/pathologieService";

class PathologieForm extends Form {
  state = {
    data: {
      nom: "",
      description: "",
      considerationsSpeciales: "",
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
            err.message = "Le champ pathologie est requis.";
          }
        });
        return errors;
      }),
    description: Joi.string().allow(""),
    considerationsSpeciales: Joi.string().allow(""),
  };

  async populatePathologies() {
    try {
      const pathologie = this.props.selectedPathologie;
      if (pathologie)
        this.setState({
          data: this.mapToViewModel(pathologie),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populatePathologies();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedPathologie && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedPathologie &&
      this.state.data._id !== this.props.selectedPathologie._id
    ) {
      await this.populatePathologies();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(pathologie) {
    return {
      _id: pathologie._id,
      nom: pathologie.nom,
      description: pathologie.description,
      considerationsSpeciales: pathologie.considerationsSpeciales,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await savePathologie(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de la pathologie
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Nom pathologie")}
              {this.renderInput("description", "Description")}
              {this.renderInput(
                "considerationsSpeciales",
                "Considerations spéciales",
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

export default PathologieForm;
