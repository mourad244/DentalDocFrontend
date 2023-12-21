import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveDetailCouverture } from "../../../services/detailCouvertureService";
import _ from "lodash";

class DetailCouvertureForm extends Form {
  state = {
    data: {
      nom: "",
      couvertureId: "",
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
    couvertureId: Joi.string().required().label("Role"),
  };

  async populateDetailCouvertures() {
    try {
      const detailCouverture = this.props.selectedDetailCouverture;
      if (detailCouverture)
        this.setState({
          data: this.mapToViewModel(detailCouverture),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateDetailCouvertures();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedDetailCouverture && prevState.data._id) {
      this.setState({ data: { nom: "" } });
    }
    if (
      this.props.selectedDetailCouverture &&
      this.state.data._id !== this.props.selectedDetailCouverture._id
    ) {
      await this.populateDetailCouvertures();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(detailCouverture) {
    return {
      _id: detailCouverture._id,
      nom: detailCouverture.nom,
      couvertureId: detailCouverture.couvertureId
        ? detailCouverture.couvertureId._id
        : "",
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveDetailCouverture(data);
    this.setState({ data: { nom: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire detail couverture
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("nom", "Nom couverture")}
              {this.renderSelect(
                "couvertureId",
                "Couverture",
                this.props.couvertures,
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

export default DetailCouvertureForm;

// nom: detailCouverture.nom,
// couvertureId: detailCouverture.couvertureId,
