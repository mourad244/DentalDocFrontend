import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveCouverture } from "../../../services/couvertureService";

class CouvertureForm extends Form {
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
            err.message = "Le champ couverture est requis.";
          }
        });
        return errors;
      }),
  };

  async populateCouvertures() {
    try {
      const couverture = this.props.selectedCouverture;
      if (couverture)
        this.setState({
          data: this.mapToViewModel(couverture),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateCouvertures();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedCouverture && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedCouverture &&
      this.state.data._id !== this.props.selectedCouverture._id
    ) {
      await this.populateCouvertures();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(couverture) {
    return {
      _id: couverture._id,
      nom: couverture.nom,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveCouverture(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de la couverture
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Nom")}
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

export default CouvertureForm;
