import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveProvince } from "../../../services/provinceService";
import _ from "lodash";

class ProvinceForm extends Form {
  state = {
    data: {
      nom: "",
      regionId: "",
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
            err.message = "Le champ province est requis.";
          }
        });
        return errors;
      }),

    regionId: Joi.string().allow("").allow(null),
    code: Joi.string().allow("").allow(null),
  };

  async populateProvinces() {
    try {
      const province = this.props.selectedProvince;
      if (province)
        this.setState({
          data: this.mapToViewModel(province),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateProvinces();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedProvince && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedProvince &&
      this.state.data._id !== this.props.selectedProvince._id
    ) {
      await this.populateProvinces();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(province) {
    return {
      _id: province._id,
      nom: province.nom,
      code: province.code,
      regionId: province.regionId ? province.regionId._id : "",
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveProvince(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };
  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire province
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              <div className="mt-3">
                {this.renderInput("nom", "Nom province")}
              </div>

              <div className="mt-3">
                {this.renderSelect("regionId", "Région", this.props.regions)}
              </div>
              <div className="mt-3">{this.renderInput("code", "Code")}</div>
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

export default ProvinceForm;

// nom: province.nom,
// regionId: province.regionId,
