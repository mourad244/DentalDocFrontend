import React from "react";
import Joi from "joi-browser";
import Form from "../../common/form";
import { savePatient } from "../../services/patientService";
import { withRouter } from "react-router-dom";

import "./reportForm.css";

class ReportForm extends Form {
  state = {
    data: {
      patient: this.props.selectedPatient,
      acteSoins: "",
      acteProtheses: "",
      totalActes: "",
      recetteSoins: "",
      recetteProtheses: "",
      //   isAJour:false
    },
    errors: {},
  };

  schema = {
    // _id: Joi.string(),
    patient: Joi.object().label("Patient"),
    acteSoins: Joi.number().allow("").label("Actes Soins"),
    acteProtheses: Joi.number().allow("").label("actes Protheses"),
    totalActes: Joi.number().required().label("Total Actes"),
    recetteSoins: Joi.number().required().label("recette Soins"),
    recetteProtheses: Joi.number().required().label("recette Protheses"),
  };
  doSubmit = async () => {
    let newPatient = { ...this.state.data.patient };
    newPatient.report.acteSoins = this.state.data.acteSoins;
    newPatient.report.acteProtheses = this.state.data.acteProtheses;
    newPatient.report.totalActes = this.state.data.totalActes;
    newPatient.report.recetteSoins = this.state.data.recetteSoins;
    newPatient.report.recetteProtheses = this.state.data.recetteProtheses;
    newPatient.report.isAJour = true;
    newPatient.adherenceId = newPatient.adherenceId._id;
    if (newPatient.serviceArmeId)
      newPatient.serviceArmeId = newPatient.serviceArmeId._id;
    delete newPatient.__v;
    await savePatient(newPatient);
    this.props.history.push("/ajouterreport");
  };
  componentDidMount() {
    this.populateReport();
  }
  componentDidUpdate(prevProps) {
    if (this.props.selectedPatient._id !== prevProps.selectedPatient._id) {
      this.setState({
        data: {
          patient: this.props.selectedPatient,
          acteSoins: this.props.selectedPatient.report.acteSoins,
          acteProtheses: this.props.selectedPatient.report.acteProtheses,
          totalActes: this.props.selectedPatient.report.totalActes,
          recetteSoins: this.props.selectedPatient.report.recetteSoins,
          recetteProtheses: this.props.selectedPatient.report.recetteProtheses,
        },
      });
    }
  }

  populateReport() {
    let newData = { ...this.state.data };
    newData.acteProtheses = this.state.data.patient.report.acteProtheses;
    newData.acteSoins = this.state.data.patient.report.acteSoins;
    newData.totalActes = this.state.data.patient.report.totalActes;
    newData.recetteProtheses = this.state.data.patient.report.recetteProtheses;
    newData.recetteSoins = this.state.data.patient.report.recetteSoins;
    this.setState({ data: newData });
  }

  render() {
    return (
      <div className="paiement-form report-form">
        <div className="form-container">
          <h1 className="titre-form">Reports</h1>
          <div className="form">
            <div>
              {this.renderInput("acteSoins", "Actes Soins")}
              {this.renderInput("acteProtheses", "Actes Prothèses")}
              {this.renderInput("totalActes", "Total des actes")}
            </div>
            <div>
              {this.renderInput("recetteSoins", "Recette Soins")}
              {this.renderInput("recetteProtheses", "Recette Prothèses")}
            </div>
            <div className="render-button">
              <button
                className={
                  !this.validate()
                    ? "render-button-active"
                    : "render-button-desactivated"
                }
                onClick={() => {
                  this.props.resetSelectedPatient();
                  this.doSubmit();
                }}
              >
                Sauvgarder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ReportForm);
