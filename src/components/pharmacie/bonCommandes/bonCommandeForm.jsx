import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";

import { getLots } from "../../../services/pharmacie/lotService";
import {
  getBonCommande,
  saveBonCommande,
} from "../../../services/pharmacie/bonCommandeService";

import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";

class BonCommandeForm extends Form {
  state = {
    data: {
      numOrdre: "",
      date: "",
      objet: "",
      societeRetenuId: "",
      montantHT: "",
      montantTTC: "",
      tva: "",
      commentaire: "",
      articles: [],
      images: [],
      imagesDeletedIndex: [],
    },
    lots: [],
    filteredArticles: [],
    errors: {},
    form: "bonCommandes",
    loading: false,
  };
  schema = {
    _id: Joi.string(),
    numOrdre: Joi.string().allow("").allow(null).label("Numéro d'ordre"),
    date: Joi.date().allow("").allow(null).label("Date"),
    objet: Joi.string().allow("").allow(null).label("Objet"),
    societeRetenuId: Joi.string()
      .allow("")
      .allow(null)
      .label("Société retenue"),
    montantHT: Joi.number().allow("").allow(null).label("Montant HT"),
    montantTTC: Joi.number().allow("").allow(null).label("Montant TTC"),
    tva: Joi.number().allow("").allow(null).label("TVA"),
    commentaire: Joi.string().allow("").allow(null).label("Commentaire"),
    articles: Joi.array().items(Joi.object()).label("Articles"),
    images: Joi.label("Images").optional(),
    imagesDeletedIndex: Joi.label("imagesDeletedIndex").optional(),
  };

  async populateDatas() {
    const { data: lots } = await getLots();
    this.setState({ lots });
  }
  async populateBonCommandes() {
    try {
      const bonCommandeId =
        this.props.match &&
        this.props.match.params &&
        this.props.match.params.id;
      const selectedBonCommande = this.props.selectedBonCommande;
      if (selectedBonCommande) {
        return this.setState({
          data: this.mapToViewModel(selectedBonCommande),
        });
      }
      if (bonCommandeId === "new" || bonCommandeId === undefined) return;
      const { data: bonCommande } = await getBonCommande(bonCommandeId);

      this.setState({ data: this.mapToViewModel(bonCommande) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    this.setState({ loading: true });
    await this.populateDatas();
    await this.populateBonCommandes();
    this.setState({ loading: false });
    this.props &&
      this.props.dataIsValid &&
      this.props.dataIsValid(this.validate() ? false : true);
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }

    if (prevState.data !== this.state.data && this.props.onBonCommandeChange) {
      const { data } = this.state;
      this.props.onBonCommandeChange(data);
      this.props.dataIsValid(this.validate() ? false : true);
    }
    // if selectedBonCommande is updated
    if (
      prevProps.selectedBonCommande &&
      this.props.selectedBonCommande &&
      prevProps.selectedBonCommande._id !== this.props.selectedBonCommande._id
    ) {
      this.setState({
        data: this.mapToViewModel(this.props.selectedBonCommande),
      });
    }
  }

  mapToViewModel(bonCommande) {
    return {
      _id: bonCommande._id,
      numOrdre: bonCommande.numOrdre,
      date: bonCommande.date,
      objet: bonCommande.objet,
      societeRetenuId: bonCommande.societeRetenuId
        ? bonCommande.societeRetenuId._id
        : "",
      montantHT: bonCommande.montantHT,
      montantTTC: bonCommande.montantTTC,
      tva: bonCommande.tva,
      commentaire: bonCommande.commentaire,
      articles: bonCommande.articles,
      imagesDeletedIndex: [],
      images: bonCommande.images ? bonCommande.images : [],
    };
  }

  doSubmit = async () => {
    let result = { ...this.state.data };
    this.setState({ loading: true });
    await saveBonCommande(result);
    this.setState({ loading: false });
    if (this.props.match) this.props.history.push("/boncommandes");
    else window.location.reload();
  };

  render() {
    const { lots, loading, data } = this.state;
    return loading ? (
      <div className="m-auto my-4">
        <ClipLoader loading={loading} size={70} />
      </div>
    ) : (
      <div
        className={`mt-1 h-[fit-content] w-[100%] min-w-fit rounded-tr-md ${"border border-white bg-white"}`}
      >
        {(!this.props ||
          (this.props && !this.props.selectedBonCommande) ||
          (this.props.selectedBonCommande &&
            !this.props.selectedBonCommande._id)) && (
          <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
            Formulaire du bon de commande
          </p>
        )}
        {
          <div className="ml-2  flex justify-start">
            <button
              className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
              onClick={() => {
                this.props.history.push("/boncommandes");
              }}
            >
              <IoChevronBackCircleSharp className="mr-1 " />
              Retour à la Liste
            </button>
          </div>
        }
        <form
          className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
          onSubmit={this.handleSubmit}
        >
          <div className="mt-3 w-full  ">
            {this.renderUpload("image", "Photo")}
          </div>
          <div className="  mt-3 flex w-full flex-wrap">
            {data.images.length !== 0 &&
              this.renderImage("images", "Images", 200)}
          </div>
          {this.renderButton("Sauvegarder")}
        </form>
      </div>
    );
  }
}

export default BonCommandeForm;
