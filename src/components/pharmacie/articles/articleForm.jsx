import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";
import {
  getArticle,
  saveArticle,
} from "../../../services/pharmacie/articleService";
import { getUniteMesures } from "../../../services/pharmacie/uniteMesureService";
import { getUniteReglementaires } from "../../../services/pharmacie/uniteReglementaireService";
// import FicheArticle from "../../documents/ficheArticle";

import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { getLots } from "../../../services/pharmacie/lotService";

class ArticleForm extends Form {
  state = {
    data: {
      nom: "",
      code: "",
      lotId: "",
      isExpiration: undefined,
      uniteMesureId: "",
      uniteReglementaireId: "",
      prixHT: "",
      prixTTC: "",
      tauxTVA: "",
      stockInitial: "",
      stockAlerte: "",
      images: [],
      imagesDeletedIndex: [],
    },
    uniteReglementaires: [],
    // filteredUniteMesures: [],
    uniteMesures: [],
    errors: {},
    form: "articles",
    loading: false,
  };
  schema = {
    _id: Joi.string(),
    lotId: Joi.string().allow("").allow(null).label("Lot"),
    isExpiration: Joi.boolean().required().label("Expiration"),
    code: Joi.string().allow("").allow(null).label("Code"),
    nom: Joi.string().required().label("Nom"),
    stockInitial: Joi.number().allow("").allow(null).label("Stock initial"),
    stockAlerte: Joi.number().allow("").allow(null).label("Stock alert"),
    uniteMesureId: Joi.string().allow("").allow(null).label("UniteMesure"),
    uniteReglementaireId: Joi.string()
      .allow("")
      .allow(null)
      .label("UniteReglementaire"),
    prixHT: Joi.number().allow("").allow(null).label("Prix HT"),
    prixTTC: Joi.number().allow("").allow(null).label("Prix TTC"),
    tauxTVA: Joi.number().allow("").allow(null).label("Taux TVA"),
    images: Joi.label("Images").optional(),
    imagesDeletedIndex: Joi.label("imagesDeletedIndex").optional(),
  };

  async populateDatas() {
    const { data: uniteMesures } = await getUniteMesures();
    const { data: uniteReglementaires } = await getUniteReglementaires();
    const { data: lots } = await getLots();
    this.setState({ uniteMesures, uniteReglementaires, lots });
  }
  async populateArticles() {
    try {
      const articleId =
        this.props.match &&
        this.props.match.params &&
        this.props.match.params.id;
      const selectedArticle = this.props.selectedArticle;
      if (selectedArticle) {
        return this.setState({ data: this.mapToViewModel(selectedArticle) });
      }
      if (articleId === "new" || articleId === undefined) return;
      const { data: article } = await getArticle(articleId);

      this.setState({ data: this.mapToViewModel(article) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    this.setState({ loading: true });
    await this.populateDatas();
    await this.populateArticles();
    this.setState({ loading: false });
    this.props &&
      this.props.dataIsValid &&
      this.props.dataIsValid(this.validate() ? false : true);
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
    // if (
    //   prevState.data.uniteReglementaireId !==
    //   this.state.data.uniteReglementaireId
    // ) {
    //   this.setState({
    //     filteredUniteMesures: this.state.uniteMesures.filter(
    //       (uniteMesure) =>
    //         uniteMesure.uniteReglementaireId._id ===
    //         this.state.data.uniteReglementaireId,
    //     ),
    //   });
    // }
    // when updating the article
    if (
      prevState.data !== this.state.data &&
      this.props.onArticleChange
      /*
      &&
      this.state.data._id 
       &&
      prevState.data._id */
    ) {
      const { data } = this.state;
      this.props.onArticleChange(data);
      this.props.dataIsValid(this.validate() ? false : true);
    }
    // if selectedArticle is updated
    if (
      prevProps.selectedArticle &&
      this.props.selectedArticle &&
      prevProps.selectedArticle._id !== this.props.selectedArticle._id
    ) {
      this.setState({ data: this.mapToViewModel(this.props.selectedArticle) });
    }
  }

  mapToViewModel(article) {
    return {
      _id: article._id,
      nom: article.nom ? article.nom : "",
      code: article.code ? article.code : "",
      lotId: article.lotId ? article.lotId : "",
      isExpiration:
        article.isExpiration === true || article.isExpiration === false
          ? article.isExpiration
          : undefined,
      uniteMesureId: article.uniteMesureId ? article.uniteMesureId : "",
      uniteReglementaireId: article.uniteReglementaireId
        ? article.uniteReglementaireId
        : "",
      prixHT: article.prixHT ? article.prixHT : "",
      prixTTC: article.prixTTC ? article.prixTTC : "",
      tauxTVA: article.tauxTVA ? article.tauxTVA : "",
      stockInitial: article.stockInitial ? article.stockInitial : "",
      stockAlerte: article.stockAlerte ? article.stockAlerte : "",
      images: article.images ? article.images : [],
      imagesDeletedIndex: [],
    };
  }

  doSubmit = async () => {
    let result = { ...this.state.data };
    this.setState({ loading: true });
    await saveArticle(result);
    this.setState({ loading: false });
    if (this.props.match) this.props.history.push("/articles");
    else window.location.reload();
  };

  render() {
    const {
      uniteReglementaires /*, filteredUniteMesures */,
      uniteMesures,
      lots,
      loading,
      data,
    } = this.state;
    const { isRdvForm } = this.props;
    return loading ? (
      <div className="m-auto my-4">
        <ClipLoader loading={loading} size={70} />
      </div>
    ) : (
      <div
        className={`mt-1 h-[fit-content] w-[100%] min-w-fit rounded-tr-md ${
          !isRdvForm && "border border-white bg-white"
        }`}
      >
        {(!this.props ||
          (this.props && !this.props.selectedArticle) ||
          (this.props.selectedArticle && !this.props.selectedArticle._id)) && (
          <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
            Formulaire du article
          </p>
        )}
        {!isRdvForm && (
          <div className="ml-2  flex justify-start">
            <button
              className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
              onClick={() => {
                this.props.history.push("/articles");
              }}
            >
              <IoChevronBackCircleSharp className="mr-1 " />
              Retour à la Liste
            </button>
          </div>
        )}
        <form
          className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
          onSubmit={this.handleSubmit}
        >
          <div className="mt-3">{this.renderInput("nom", "Nom")}</div>
          <div className="mt-3">{this.renderSelect("lotId", "Lot", lots)}</div>
          <div className="mt-3">{this.renderInput("code", "Code")}</div>
          <div className="mt-3">
            {this.renderSelect(
              "uniteReglementaireId",
              "UniteReglementaire",
              uniteReglementaires,
            )}
          </div>
          <div className="mt-3">
            {this.renderSelect("uniteMesureId", "UniteMesure", uniteMesures)}
          </div>
          <div className="mt-3">
            {this.renderInput("prixHT", "Prix HT", 170, 35, "number")}
          </div>
          <div className="mt-3">
            {this.renderInput("prixTTC", "Prix TTC", 170, 35, "number")}
          </div>
          <div className="mt-3">
            {this.renderInput("tauxTVA", "Taux TVA", 170, 35, "number")}
          </div>
          <div className="mt-3">
            {this.renderInput(
              "stockInitial",
              "Stock initial",
              170,
              35,
              "number",
            )}
          </div>
          <div className="mt-3">
            {this.renderInput("stockAlerte", "Stock alert", 170, 35, "number")}
          </div>
          <div className="mt-3">
            {this.renderBoolean("isExpiration", "Expiration ?", "Oui", "Non")}
          </div>
          <div className="mt-3 w-full  ">
            {this.renderUpload("image", "Photo")}
          </div>
          <div className="  mt-3 flex w-full flex-wrap">
            {data.images.length !== 0 &&
              this.renderImage("images", "Images", 200)}
          </div>
          {this.renderButton("Sauvegarder")}
        </form>
        {/* {articleId ? (
          <FicheArticle
            data={{
              ...this.state.data,
            }}
            document={<FicheArticle />}
          />
        ) : (
          ""
        )} */}
      </div>
    );
  }
}

export default ArticleForm;
