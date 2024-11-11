import React from "react";
import Joi from "joi-browser";

import { saveActeDentaire } from "../../../services/acteDentaireService";

import Form from "../../../common/form";
import Input from "../../../common/input";
import ArticleSearch from "../../pharmacie/articles/articleSearch";

import { v4 as uuidv4 } from "uuid";
import { GoTriangleUp } from "react-icons/go";
import { GoTriangleDown } from "react-icons/go";
import ArticleSelect from "../../pharmacie/articles/articleSelect";

class ActeDentaireForm extends Form {
  state = {
    data: {
      nom: "",
      abreviation: "",
      natureId: "",
      code: "",
      prix: "",
      duree: "",
      moments: [],
      articles: [],
    },

    formDisplay: false,
    startSearch: false,
    articleForm: true,
    fields: [
      { order: 1, name: "select", label: "Select", isActivated: false },
      { order: 2, name: "nom", label: "Nom" },
      { order: 3, name: "abreviation", label: "Abréviation" },

      { order: 4, name: "code", label: "Code" },
      { order: 5, name: "lotId", label: "Lot" },
      { order: 6, name: "stockInitial", label: "Stock Initial" },
      { order: 7, name: "stockAlerte", label: "Stock Alerte" },
      { order: 8, name: "uniteMesureId", label: "Unite Mesure" },
      { order: 9, name: "uniteReglementaireId", label: "Unite Reglementaire" },
      { order: 10, name: "prixHT", label: "Prix HT" },
      { order: 11, name: "tauxTVA", label: "Taux TVA" },
      { order: 12, name: "isExpiration", label: "Expiration" },
      { order: 13, name: "prixTTC", label: "Prix TTC" },
      { order: 14, name: "stockActuel", label: "Stock Actuel" },
    ],
    articleFields: [
      // code, designation, qte a utiliser
      {
        order: 1,
        name: "code",
        label: "Code",
      },
      { order: 2, name: "nom", label: "Désignation" },
      {
        order: 3,
        name: "quantite",
        label: "Qte à utiliser",
        isNumber: true,
        isInput: true,
      },
    ],
    selectedFields: [
      { order: 1, name: "select", label: "Select", isActivated: false },
      { order: 2, name: "nom", label: "Nom" },
      { order: 3, name: "code", label: "Code" },
      { order: 9, name: "uniteMesureId", label: "Unite Mesure" },
      { order: 10, name: "uniteReglementaireId", label: "Unite Reglementaire" },
      { order: 11, name: "isExpiration", label: "Expiration" },
    ],
    sortColumn: { path: "nom", order: "asc" },
    loadingArticles: false,
    selecteDLots: [],
    filteredArticles: [],
    searchQuery: "",
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    nom: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.type === "any.empty") {
            err.message = "Le champ acte dentaire est requis.";
          }
        });
        return errors;
      }),
    abreviation: Joi.string().allow(""),

    natureId: Joi.string().allow(""),
    code: Joi.number().allow(""),
    prix: Joi.number().allow(""),
    duree: Joi.number().allow(""),
    articles: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string(),
          articleId: Joi.object().label("Article"),
          quantite: Joi.number().min(1).required().label("Quantité"),
          code: Joi.string().required().label("Code"),
          nom: Joi.string().required().label("Nom"),
          lotId: Joi.string().required().label("Lot"),
        }),
      )
      .label("Articles"),
    moments: Joi.array().allow(""),
  };

  async populateActeDentaires() {
    try {
      const acteDentaire = this.props.selectedActeDentaire;
      if (acteDentaire) {
        let selecteDLots = [];
        acteDentaire.articles = acteDentaire.articles.map((item) => {
          let lot = this.props.datas.lots.find(
            (c) => c._id === (item.articleId && item.articleId.lotId),
          );
          if (lot) selecteDLots.push(lot);
          return {
            _id: item.articleId._id,
            articleId: item.articleId,
            quantite: item.quantite,
            code: item.articleId.code,
            nom: item.articleId.nom,
            lotId: item.articleId.lotId,
          };
        });
        let articleForm = true;
        if (acteDentaire.articles.length > 0) {
          articleForm = false;
        }
        this.setState({
          data: this.mapToViewModel(acteDentaire),
          selecteDLots,
          articleForm,
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace(":not-found");
    }
  }

  async componentDidMount() {
    await this.populateActeDentaires();
  }
  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedActeDentaire && prevState.data._id) {
      this.setState({
        data: {
          nom: "",
          abreviation: "",
          natureId: "",
          code: "",
          prix: "",
          duree: "",
          moments: [],
          articles: [],
        },
      });
    }
    if (
      this.props.selectedActeDentaire &&
      this.state.data._id !== this.props.selectedActeDentaire._id
    ) {
      await this.populateActeDentaires();
    }
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }
  }

  handleSelectArticle = (article) => {
    let newArticles = [...this.state.data.articles];
    const index = newArticles.findIndex((c) => {
      return c.articleId._id === article._id;
    });
    if (index === -1) {
      newArticles.push({
        articleId: article,
        quantite: 1,
        code: article.code,
        nom: article.nom,
        lotId: article.lotId,
      });
    } else {
      newArticles.splice(index, 1);
    }
    this.setState({ data: { ...this.state.data, articles: newArticles } });
  };
  handleSort(sortColumn) {
    this.setState({ sortColumn });
  }
  mapToViewModel(acteDentaire) {
    return {
      _id: acteDentaire._id,
      nom: acteDentaire.nom,
      abreviation: acteDentaire.abreviation,
      natureId: acteDentaire.natureId ? acteDentaire.natureId._id : "",
      code: acteDentaire.code,
      prix: acteDentaire.prix,
      duree: acteDentaire.duree,
      moments: acteDentaire.moments ? acteDentaire.moments : [],
      articles: acteDentaire.articles,
    };
  }
  onArticleFormDisplay = () => {
    this.setState({ articleForm: !this.state.articleForm });
  };

  handleSelectSelectedArticle = (article) => {
    let newArticles = [...this.state.data.articles];
    const index = newArticles.findIndex(
      (c) => c.articleId === article.articleId,
    );
    newArticles.splice(index, 1);
    this.setState({ data: { ...this.state.data, articles: newArticles } });
  };
  handleChangeItem = (e, article, field) => {
    let newArticles = [...this.state.data.articles];
    const index = newArticles.findIndex(
      (c) => c.articleId === article.articleId,
    );

    newArticles[index][field] = e;
    this.setState({ data: { ...this.state.data, articles: newArticles } });
  };

  doSubmit = async () => {
    let { data } = this.state;
    await saveActeDentaire(data);
    this.setState({
      data: {
        nom: "",
        abreviation: "",
        natureId: "",
        code: "",
        prix: "",
        duree: "",
        moments: [],
        articles: [],
      },
    });
    this.props.updateData();
  };

  render() {
    const { data } = this.state;
    const { datas, formDisplay } = this.props;
    return (
      <>
        {formDisplay ? (
          <div className="mt-1 h-[fit-content] w-full rounded-tr-md border border-white bg-white shadow-md">
            <p className="ml-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Formulaire acte dentaire
            </p>
            <form
              className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
              onSubmit={this.handleSubmit}
            >
              <div className="mt-3">{this.renderInput("nom", "Nom acte")}</div>
              <div className="mt-3">
                {this.renderInput("abreviation", "Abréviation")}
              </div>

              <div className="mt-3">
                {this.renderSelect(
                  "natureId",
                  "Nature acte",
                  datas.natureActes,
                )}
              </div>
              <div className="mt-3">
                {this.renderInput("code", "Code", 170, 35, "number")}
              </div>
              <div className="mt-3">
                {this.renderInput("prix", "Prix", 170, 35, "number")}
              </div>
              <div className="mt-3">
                {this.renderInput(
                  "duree",
                  "Duree en minutes",
                  170,
                  35,
                  "number",
                )}
              </div>
              <div className="mt-3">
                {this.renderCheckboxes(
                  "moments",
                  "Temps préféré",
                  200,
                  96,
                  ["matin", "apres-midi", "soir"],
                  ["Matin", "Après-midi", "Soir"],
                )}
              </div>
              <ArticleSelect
                articles={data.articles}
                handleChangeItem={this.handleChangeItem}
                handleSelectArticle={this.handleSelectSelectedArticle}
                title="Articles à utiliser"
                fields={this.state.articleFields}
              />

              <div className="ml-2 mt-2 flex w-full items-center ">
                <label className="mr-2 text-xl font-bold text-[#474a52]">
                  Ajouter des articles à utiliser
                </label>
                {!this.state.articleForm ? (
                  <GoTriangleDown
                    className="cursor-pointer"
                    onClick={this.onArticleFormDisplay}
                  />
                ) : (
                  <GoTriangleUp
                    className="cursor-pointer"
                    onClick={this.onArticleFormDisplay}
                  />
                )}
              </div>
              {this.state.articleForm && (
                <ArticleSearch
                  datas={datas}
                  onSelectArticle={this.handleSelectArticle}
                  selectedArticles={data.articles}
                />
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

export default ActeDentaireForm;

// nom: acteDentaire.nom,
// natureId: acteDentaire.natureId,
