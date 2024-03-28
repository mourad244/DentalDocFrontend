import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveLot } from "../../../services/pharmacie/lotService";
class LotForm extends Form {
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
            err.message = "Le champ lot est requis.";
          }
        });
        return errors;
      }),
  };

  async populateLots() {
    try {
      const lot = this.props.selectedLot;
      if (lot)
        this.setState({
          data: this.mapToViewModel(lot),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateLots();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedLot && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedLot &&
      this.state.data._id !== this.props.selectedLot._id
    ) {
      await this.populateLots();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(lot) {
    return {
      _id: lot._id,
      nom: lot.nom,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveLot(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire du lot
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              <div className="mt-3">
                {this.renderInput("nom", "Nom lot", 170, 35, "text", 120)}
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

export default LotForm;
