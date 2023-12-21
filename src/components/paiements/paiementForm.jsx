import React from "react";
import Joi from "joi-browser";
import Form from "../../common/form";
import { savePaiement } from "../../services/paiementService";
import { withRouter } from "react-router-dom";

import "./paiementForm.css";
import RecuPaiement from "../../documents/recuPaiement";

class PaiementForm extends Form {
  state = {
    data: {
      patientId: this.props.selectedPatient._id,
      numRecu: "",
      natureActeId: "",
      modePaiement: "Espèce",
      numCheque: undefined,
      datePaiement: "",
      montant: "",
      // isSoins: undefined,
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    // isSoins: Joi.boolean().label("Nature Paiement"),
    patientId: Joi.string().allow("").label("Patient"),
    natureActeId: Joi.string().allow("").label("Nature Acte"),
    numRecu: Joi.number().allow(null),
    modePaiement: Joi.string().label("Mode Paiement"),
    numCheque: Joi.string().allow("").label("Numero Cheque"),
    datePaiement: Joi.date().label("Date"),
    montant: Joi.number().required().label("Montant"),
  };

  doSubmit = async () => {
    await savePaiement(this.state.data);
    this.props.history.push("/paiements");
  };
  handleModePaiementSelect = (e) => {
    let paiements = { ...this.state.data };
    paiements.modePaiement = e.target.value;
    this.setState({ data: paiements });
  };
  render() {
    const { data } = this.state;
    return (
      <div className="paiement-form">
        <div className="form-container">
          <h1 className="titre-form">Paiement</h1>
          <form className="form" onSubmit={this.handleSubmit}>
            {this.renderSelect(
              "natureActeId",
              "Nature de l'acte",
              this.props.natureActes
            )}
            {this.renderInput("numRecu", "Numero Recu")}
            {this.renderDate("datePaiement", "Date")}
            {this.renderInput("montant", "Montant")}
            {
              <div className="select-component">
                <label htmlFor={"modePaiement"}>{"Mode Paiement"}</label>
                <select
                  id={"modePaiement"}
                  name="modePaiement"
                  onChange={(e) => this.handleModePaiementSelect(e)}
                >
                  {["Espèce", "Chèque"].map((option) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>
            }
            {this.renderInput("numCheque", "Numero Chèque")}
            {this.renderButton("Sauvegarder")}
          </form>

          {data.patientId ? (
            <RecuPaiement
              data={{ ...this.state.data }}
              selectedPatient={this.props.selectedPatient}
              natureActes={this.props.natureActes}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(PaiementForm);
