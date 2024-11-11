import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import { saveDent } from "../../../services/dentService";

class DentForm extends Form {
  state = {
    data: {
      numeroFDI: "",
      description: "",
      code: "",
    },
    formDisplay: false,
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    numeroFDI: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ dent est requis.";
          }
        });
        return errors;
      }),
    description: Joi.string(),
    code: Joi.string(),
  };

  async populateDents() {
    try {
      const dent = this.props.selectedDent;
      if (dent)
        this.setState({
          data: this.mapToViewModel(dent),
        });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateDents();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedDent && prevState.data._id) {
      this.setState({
        data: {
          numeroFDI: "",
          description: "",
          code: "",
        },
      });
    }
    if (
      this.props.selectedDent &&
      this.state.data._id !== this.props.selectedDent._id
    ) {
      await this.populateDents();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  mapToViewModel(dent) {
    return {
      _id: dent._id,
      numeroFDI: dent.numeroFDI,
      description: dent.description,
      code: dent.code,
    };
  }
  doSubmit = async () => {
    let { data } = this.state;
    await saveDent(data);
    this.setState({ data: { numeroFDI: "", description: "", code: "" } });
    this.props.updateData();
  };

  render() {
    return (
      <>
        {this.props.formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire de la dent
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              <div className="mt-3">
                {this.renderInput("numeroFDI", "N° FDI dent")}
              </div>
              <div className="mt-3">
                {this.renderInput("description", "Description")}
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

export default DentForm;
