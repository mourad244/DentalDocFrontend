import React from "react";
import { withRouter } from "react-router-dom";

import { getDevi } from "../../services/deviService";
import { getBonCommandes } from "../../services/bonCommandeService";
import { savePaiementBC, getPaiementBC } from "../../services/paiementService";

import Form from "../../common/form";
import PaiementBCActesTable from "./paiementActesTable";
import PaiementBCEffectuesTable from "./paiementEffectuesTable";

import Joi from "joi-browser";
import ClipLoader from "react-spinners/ClipLoader";

import { IoChevronBackCircleSharp } from "react-icons/io5";
import SearchBonCommande from "../../common/searchPatient";
// import RecuPaiementBC from "../../documents/recuPaiementBC";
import { getBonCommande } from "../../../services/pharmacie/bonCommandeService";

class PaiementBCForm extends Form {
  state = {
    data: {
      bonCommandeId: "",
      date: new Date(),
      montant: "",
      mode: "Espèce",
      numCheque: undefined,
      numOrdre: "",
    },
    errors: {},
    selectedBonCommande: {},
    sortColumn: { path: "date", order: "desc" },
    devis: [],
    paiementBCs: [],
    actesEffectues: [],
    nombreActes: 1,
    loading: false,
    loadingBonCommande: false,
  };

  schema = {
    _id: Joi.string(),
    bonCommandeId: Joi.string().allow("").label("Patient"),
    date: Joi.date().label("Date"),
    montant: Joi.number().required().label("Montant"),
    mode: Joi.string().label("Mode PaiementBC"),
    numCheque: Joi.string().allow("").label("Numero Cheque"),
    numOrdre: Joi.number().allow("").allow(null).label("Numéro d'ordre"),
  };

  async populateDatas() {
    this.setState({ loading: true });
    const paiementBCId = this.props.match.params.paiementBCId;
    const bonCommandeId = this.props.match.params.bonCommandeid;
    if (paiementBCId === "new" || paiementBCId === undefined) {
      if (bonCommandeId) {
        const { data: bonCommande } = await getBonCommande(bonCommandeId);
        let newData = { ...this.state.data };
        let newSelectedPaiementBCs = [];

        if (
          bonCommande.paiementIds !== undefined &&
          bonCommande.paiementIds !== null &&
          bonCommande.paiementIds.length !== 0
        ) {
          const promises = bonCommande.paiementIds.map((item) =>
            getPaiementBC(item._id),
          );
          const paiementBCsResults = await Promise.all(promises);
          newSelectedPaiementBCs = paiementBCsResults.map(
            ({ data: paiement }) => paiement,
          );
        }
        newData.bonCommandeId = bonCommande._id;
        this.setState({
          data: newData,
          selectedBonCommande: bonCommande,
          paiementBCs: newSelectedPaiementBCs,
          loaded: true,
        });
      }
      this.setState({});
    } else {
      const { data: paiement } = await getPaiementBC(paiementBCId);
      this.setState({
        data: this.mapToViewModel(paiement),
        selectedBonCommande: paiement.bonCommandeId,
      });
    }
    this.setState({ loading: false });
  }

  onSelectBonCommande = async (bonCommande) => {
    this.setState({
      loadingBonCommande: true,
    });
    let data = { ...this.state.data };
    const { data: fetchedBonCommande } = await getBonCommandes(bonCommande._id);
    let newSelectedPaiementBCs = [];

    data.bonCommandeId = fetchedBonCommande._id;
    this.setState({
      data,
      selectedBonCommande: fetchedBonCommande,
      paiementBCs: newSelectedPaiementBCs,
      loadingBonCommande: false,
    });
  };
  async componentDidMount() {
    await this.populateDatas();
  }

  async componentDidUpdate(prevProps, prevState) {}
  mapToViewModel(paiement) {
    return {
      _id: paiement._id,
      bonCommandeId: paiement.bonCommandeId._id,
      date: paiement.date,
      montant: paiement.montant,
      mode: paiement.mode,
      numCheque: paiement.numCheque,
      numOrdre: paiement.numOrdre,
    };
  }
  doSubmit = async () => {
    let data = { ...this.state.data };
    await savePaiementBC(data);
    this.props.history.push("/paiementBCs");
  };
  handleModePaiementBCSelect = (e) => {
    let paiementBCs = { ...this.state.data };
    paiementBCs.mode = e.target.value;
    this.setState({ data: paiementBCs });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  render() {
    const {
      // data,
      selectedBonCommande,
      loading,
      loadingBonCommande,
      paiementBCs,
      // devis,
    } = this.state;
    const paiementBCId = this.props.match.params.paiementid;
    const bonCommandeId = this.props.match.params.bonCommandeid;
    return loading ? (
      <div className="m-auto my-4">
        <ClipLoader loading={loading} size={70} />
      </div>
    ) : (
      <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
          Formulaire du paiement
        </p>
        <div className="ml-2  flex justify-start">
          <button
            className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
            onClick={() => {
              this.props.history.push("/paiementBCs");
            }}
          >
            <IoChevronBackCircleSharp className="mr-1" />
            Retour à la Liste
          </button>
        </div>
        {paiementBCId === "new" && (
          <SearchBonCommande onBonCommandeSelect={this.onSelectBonCommande} />
        )}
        {loadingBonCommande ? (
          <div className="m-auto my-4">
            <ClipLoader loading={loadingBonCommande} size={70} />
          </div>
        ) : (
          Object.keys(selectedBonCommande).length !== 0 && (
            <>
              <div className="m-2  rounded-sm bg-[#4F6874] p-2">
                <p className="text-center text-base font-bold text-white">{`${
                  selectedBonCommande.nom &&
                  selectedBonCommande.nom.toUpperCase()
                } ${
                  selectedBonCommande.prenom &&
                  selectedBonCommande.prenom.toUpperCase()
                }`}</p>
              </div>

              <div className="m-2 bg-[#a2bdc5]">
                <p className="w-full bg-[#81b9ca] p-2 text-xl font-bold text-[#474a52]">
                  Paiement
                </p>
                <form onSubmit={this.handleSubmit}>
                  <div className="flex flex-wrap">
                    <div className="mt-3">
                      {this.renderDate("date", "Date", 170, 35, 140)}
                    </div>
                    <div className="mt-3">
                      {this.renderInput(
                        "montant",
                        "Montant",
                        170,
                        35,
                        "number",
                        140,
                      )}
                    </div>
                    <div className="mt-3">
                      <div className=" flex w-fit flex-wrap">
                        <label
                          className="mr-3 text-right text-xs font-bold leading-9 text-[#72757c]"
                          htmlFor={"modePaiementBC"}
                          style={{ width: 140 }}
                        >
                          Mode PaiementBC
                        </label>
                        <div className="flex w-fit flex-wrap">
                          <select
                            id={"modePaiementBC"}
                            name="mode"
                            style={{
                              height: 35,
                              width: 170,
                            }}
                            className=" w-24 rounded-md	border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
                            onChange={(e) => this.handleModePaiementBCSelect(e)}
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
                      </div>
                    </div>
                  </div>
                  <div className="m-3">{this.renderButton("Sauvegarder")}</div>
                </form>
              </div>
            </>
          )
        )}
      </div>
    );
  }
}

export default withRouter(PaiementBCForm);
