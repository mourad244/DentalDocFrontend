import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveRegion } from "../../../services/regionService";

class RegionForm extends Form {
  state = {
    data: {
      nom: "",
      code: "",
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
            err.message = "Le champ region est requis.";
          }
        });
        return errors;
      }),
    code: Joi.number().allow("").allow(null),
  };

  async populateRegions() {
    try {
      const region = this.props.selectedRegion;
      if (region)
        this.setState({
          data: this.mapToViewModel(region),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateRegions();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedRegion && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedRegion &&
      this.state.data._id !== this.props.selectedRegion._id
    ) {
      await this.populateRegions();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(region) {
    return {
      _id: region._id,
      nom: region.nom,
      code: region.code,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveRegion(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de la région
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              <div className="mt-3">
                {this.renderInput("nom", "Nom région", 170, 35, "text", 120)}
              </div>
              <div className="mt-3">
                {this.renderInput("code", "Code", 170, 35, "number", 120)}
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

export default RegionForm;
