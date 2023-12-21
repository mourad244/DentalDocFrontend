import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveNatureActe } from "../../../services/natureActeService";

class NatureActeForm extends Form {
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
            err.message = "Le champ natureActe est requis.";
          }
        });
        return errors;
      }),
  };

  async populateNatureActes() {
    try {
      const natureActe = this.props.selectedNatureActe;
      if (natureActe)
        this.setState({
          data: this.mapToViewModel(natureActe),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateNatureActes();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedNatureActe && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedNatureActe &&
      this.state.data._id !== this.props.selectedNatureActe._id
    ) {
      await this.populateNatureActes();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(natureActe) {
    return {
      _id: natureActe._id,
      nom: natureActe.nom,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveNatureActe(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de la natureActe
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Nom ")}
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

export default NatureActeForm;
