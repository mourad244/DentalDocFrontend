import React from "react";
import Joi from "joi-browser";
import Form from "../../common/form";
import { saveDevi } from "../../services/deviService";
import { getMedecins } from "../../services/medecinService";
import { getCabinets } from "../../services/cabinetService";
import { getActeDentaires } from "../../services/acteDentaireService";
import { getNatureActes } from "../../services/natureActeService";
import { getDents } from "../../services/dentService";
import { colorsNatureActe } from "../../utils/colorsNatureActe";
import Select from "../../common/select";
import Input from "../../common/input";
import { withRouter } from "react-router-dom";

import _ from "lodash";
import "./deviForm.css";
import SchemaDent from "../../assets/icons/graphs/schemaDent";

class DeviForm extends Form {
  state = {
    data: {
      patientId: this.props.selectedPatient._id,
      medecinId: "",
      cabinetId: "",
      dateDevi: "",
      isHygieneDent: true,
      acteEffectues: [],
    },
    errors: {},
    medecins: [],
    cabinets: [],
    acteDentaires: [],
    natureActes: [],
    dents: [],
    nombreActes: 1,
    selectedNatureActes: [],
    selectedActes: [],
    selectedDents: [],
    colors: colorsNatureActe,
    filteredActeDentaires: [],
    nombreDentsPerActe: [],
  };
  schema = {
    _id: Joi.string(),
    patientId: Joi.string().allow("").label("Patient"),
    medecinId: Joi.string().allow("").label("Medecin"),
    cabinetId: Joi.string().allow("").label("Cabinet"),
    dateDevi: Joi.date().label("Date"),
    acteEffectues: Joi.array().allow([]).label("Acte Effectues"),
    isHygieneDent: Joi.boolean().allow(null).label("Hygiène Bucco Dentaire?"),
  };
  async populateDents() {
    const { data: dents } = await getDents();
    this.setState({ dents });
  }

  async populateMedecins() {
    const { data: medecins } = await getMedecins();
    this.setState({ medecins });
  }

  async populateCabinets() {
    const { data: cabinets } = await getCabinets();
    this.setState({ cabinets });
  }

  async populateActeDentaires() {
    const { data: acteDentaires } = await getActeDentaires();
    this.setState({ acteDentaires });
  }
  async populateNatureActes() {
    const { data: natureActes } = await getNatureActes();
    this.setState({ natureActes });
  }

  async componentDidMount() {
    await this.populateMedecins();
    await this.populateCabinets();
    await this.populateActeDentaires();
    await this.populateNatureActes();
    await this.populateDents();
  }

  doSubmit = async () => {
    let selectedNatureActes = [...this.state.selectedNatureActes];
    let selectedActes = [...this.state.selectedActes];
    let prixSoins = 0;
    let prixProtheses = 0;

    selectedNatureActes.map((natureItem, index) => {
      if (natureItem) {
        if (natureItem.nom === "Prothèses") {
          return this.props.selectedPatient.adherenceId.nom === "A"
            ? (prixProtheses += selectedActes[index].FA)
            : (prixProtheses +=
                selectedActes[index][
                  this.props.selectedPatient.adherenceId.nom
                ]);
        } else {
          return this.props.selectedPatient.adherenceId.nom === "A"
            ? (prixSoins += selectedActes[index].FA)
            : (prixSoins +=
                selectedActes[index][
                  this.props.selectedPatient.adherenceId.nom
                ]);
        }
      } else return "";
    });

    let newData = { ...this.state.data };
    newData.montantSoins = prixSoins;
    newData.montantProtheses = prixProtheses;

    await saveDevi(newData);
    this.props.history.push("/devis");
    // if (this.props.match) this.props.history.push("/devis");
    // else {
    //   window.location.reload();
    // }
  };
  defineActeLines = (e) => {
    e.preventDefault();
    this.setState({ nombreActes: e.target.value });
  };

  handleSelectedNature = (e, index) => {
    let selectedNatureActes = [...this.state.selectedNatureActes];
    let filteredActeDentaires = [...this.state.filteredActeDentaires];
    let selectedActes = [...this.state.selectedActes];
    let nombreDentsPerActe = [...this.state.nombreDentsPerActe];
    let selectedDents = [...this.state.selectedDents];

    let selectedNatureActe = { ...selectedNatureActes[index] };
    const selected = this.state.natureActes.find(
      (item) => item._id === e.target.value
    );
    selectedNatureActe = selected;
    /* if (!selected) {
      // delete nature Acte in array
      selectedNatureActes.splice(index, 1);
      //delete filteredActe
      filteredActeDentaires.splice(index, 1);
      // delete acte in array
      selectedActes.splice(index, 1);
      // delete nombre Dent
      nombreDentsPerActe.splice(index, 1);
      // reset nombreDent
      nombreDentsPerActe.splice(index, 1);
      this.setState({
        filteredActeDentaires,
        selectedNatureActes,
        selectedActes,
        nombreDentsPerActe,
        selectedDents,
      });
    } else { */
    selectedNatureActes[index] = selectedNatureActe;

    // set filtered actes dentaires
    let filteredActeDentaire = { ...filteredActeDentaires[index] };
    filteredActeDentaire = this.state.acteDentaires.filter((e) =>
      selected ? e.natureId === selected._id : ""
    );
    filteredActeDentaires[index] = filteredActeDentaire;

    // reset selectedActe
    delete selectedActes[index];
    // reset nombreDent
    nombreDentsPerActe[index] = 0;

    // reset selectedDent
    delete selectedDents[index];
    this.setState({
      filteredActeDentaires,
      selectedNatureActes,
      selectedActes,
      nombreDentsPerActe,
      selectedDents,
    });
    // }
  };

  handleSelectedActe = (e, index) => {
    let selectedActes = [...this.state.selectedActes];
    let selectedActe = { ...selectedActes[index] };

    const selected = this.state.acteDentaires
      //
      .find((item) => item._id === e.target.value);

    selectedActe = selected;
    selectedActes[index] = selectedActe;

    // set data
    let devis = { ...this.state.data };
    let acteEffectue = { acteId: "", dentIds: [] };
    acteEffectue.acteId = selected ? selected._id : "";
    if (!devis.acteEffectues[index]) {
      devis.acteEffectues[index] = {
        acteId: "",
        dentIds: [],
      };
    }

    devis.acteEffectues[index]["acteId"] = acteEffectue.acteId;

    this.setState({ selectedActes, data: devis });
  };

  defineNombreDentsPerActe = (e, indexActe) => {
    e.preventDefault();
    let nombreDentsPerActe = [...this.state.nombreDentsPerActe];
    nombreDentsPerActe[indexActe] = parseInt(e.target.value);
    this.setState({ nombreDentsPerActe });
  };

  handleSelectedDent = (e, indexActe, indexDent) => {
    let selectedDents = [...this.state.selectedDents];
    let selectedDent = { ...selectedDents[indexActe] };
    const selected = this.state.dents.find(
      (item) => item._id === e.target.value
    );
    selectedDent[indexDent] = selected;
    selectedDents[indexActe] = selectedDent;
    // set data
    let devis = { ...this.state.data };
    let acteEffectue = { acteId: "", dentIds: [] };
    acteEffectue.dentIds = selected ? selected._id : "";
    if (!devis.acteEffectues[indexActe]) {
      devis.acteEffectues[indexActe] = {
        acteId: "",
        dentIds: [],
      };
    }
    devis.acteEffectues[indexActe]["dentIds"][indexDent] = acteEffectue.dentIds;
    this.setState({ selectedDents, data: devis });
  };

  render() {
    const {
      cabinets,
      medecins,
      nombreActes,
      nombreDentsPerActe,
      natureActes,
      filteredActeDentaires,
      selectedNatureActes,
      selectedDents,
      colors,
      selectedActes,
      dents,
    } = this.state;
    let colorDents = {};
    selectedDents.map((acteDentItems, indexActeDents) => {
      for (const dentItem in acteDentItems) {
        if (acteDentItems[dentItem])
          colorDents[acteDentItems[dentItem]["numero"]] =
            colors[selectedNatureActes[indexActeDents]["nom"]];
      }
      return "";
    });
    return (
      <div className="devi-form">
        <div className="form-container">
          <h1 className="titre-form">Actes à éffectués</h1>
          <form className="form" onSubmit={this.handleSubmit}>
            <Input
              type="text"
              name="nombreActe"
              value={nombreActes}
              label="Nombre des actes"
              onChange={this.defineActeLines}
              width={20}
            />
            {this.renderDate("dateDevi", "Date")}
            <div className="inline-form-devi">
              {this.renderSelect("cabinetId", "Cabinet", cabinets)}
              {this.renderSelect("medecinId", "Medecin", medecins)}
              {this.renderBoolean(
                "isHygieneDent",
                "Hygiène Bucco Dentaire",
                "oui",
                "non"
              )}
            </div>
            <div className="component-body">
              <table className="table-component">
                <thead className="table-header">
                  <tr>
                    {/* <th>N° Acte</th> */}
                    <th>Nature Acte</th>
                    <th>Code Acte</th>
                    <th>Description</th>
                    <th>Nombre Dent</th>
                    <th>Dent</th>
                  </tr>
                </thead>

                <tbody>
                  {_.times(nombreActes, (indexActe) => {
                    return (
                      <tr
                        key={"acte" + indexActe}
                        style={
                          selectedNatureActes[indexActe]
                            ? {
                                background:
                                  colors[selectedNatureActes[indexActe].nom],
                              }
                            : {}
                        }
                      >
                        <td>
                          <Select
                            name="natureActe"
                            options={natureActes}
                            onChange={(e) =>
                              this.handleSelectedNature(e, indexActe)
                            }
                          />
                        </td>
                        <td>
                          {filteredActeDentaires[indexActe] &&
                          filteredActeDentaires[indexActe].length !== 0 ? (
                            <div className="select-component">
                              <select
                                name="codeActe"
                                id="codeActe"
                                onChange={(e) =>
                                  this.handleSelectedActe(e, indexActe)
                                }
                              >
                                <option value="" />
                                {filteredActeDentaires[indexActe].map(
                                  (option) => {
                                    return (
                                      <option
                                        key={indexActe + option._id}
                                        value={option._id}
                                      >
                                        {option.code}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="item-nom">
                          {selectedActes[indexActe]
                            ? selectedActes[indexActe].nom
                            : ""}
                        </td>
                        <td>
                          <Input
                            type="text"
                            name="nombreDent"
                            value={
                              nombreDentsPerActe[indexActe]
                                ? nombreDentsPerActe[indexActe]
                                : 0
                            }
                            onChange={(e) =>
                              this.defineNombreDentsPerActe(e, indexActe)
                            }
                            width={20}
                          />
                        </td>

                        {selectedActes[indexActe] ? (
                          <td className="item-dent">
                            {_.times(
                              nombreDentsPerActe[indexActe],
                              (indexDent) => {
                                return (
                                  <div
                                    className="select-component"
                                    key={indexActe + indexDent}
                                  >
                                    <select
                                      name="dent"
                                      key={
                                        "acte" + indexActe + "dent" + indexDent
                                      }
                                      onChange={(e) =>
                                        this.handleSelectedDent(
                                          e,
                                          indexActe,
                                          indexDent
                                        )
                                      }
                                    >
                                      <option value="" />
                                      {dents.map((option) => {
                                        return (
                                          <option
                                            key={
                                              "acte" +
                                              indexActe +
                                              "dent" +
                                              indexDent +
                                              option._id
                                            }
                                            value={option._id}
                                          >
                                            {option.numero}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                );
                              }
                            )}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <SchemaDent dents={colorDents} />
            </div>

            {this.renderButton("Sauvegarder")}
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(DeviForm);
