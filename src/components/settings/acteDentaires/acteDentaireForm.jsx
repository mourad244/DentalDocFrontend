import React from "react";
import Joi from "joi-browser";

import { getArticles } from "../../../services/pharmacie/articleService";
import { saveActeDentaire } from "../../../services/acteDentaireService";

import ArticlesTable from "../../pharmacie/articles/articlesTable";

import Form from "../../../common/form";
import Input from "../../../common/input";
import SearchBox from "../../../common/searchBox";
import ClipLoader from "react-spinners/ClipLoader";

import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { GoTriangleUp } from "react-icons/go";
import { GoTriangleDown } from "react-icons/go";

class ActeDentaireForm extends Form {
  state = {
    data: {
      nom: "",
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
      { order: 3, name: "code", label: "Code" },
      { order: 4, name: "lotId", label: "Lot" },
      { order: 5, name: "stockInitial", label: "Stock Initial" },
      { order: 6, name: "stockAlerte", label: "Stock Alerte" },
      { order: 7, name: "uniteMesureId", label: "Unite Mesure" },
      { order: 8, name: "uniteReglementaireId", label: "Unite Reglementaire" },
      { order: 9, name: "prixHT", label: "Prix HT" },
      { order: 10, name: "tauxTVA", label: "Taux TVA" },
      { order: 11, name: "isExpiration", label: "Expiration" },
      { order: 12, name: "prixTTC", label: "Prix TTC" },
      { order: 13, name: "stockActuel", label: "Stock Actuel" },
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
    natureId: Joi.string().allow(""),
    code: Joi.number().allow(""),
    prix: Joi.number().allow(""),
    duree: Joi.number().allow(""),
    articles: Joi.array().items(Joi.object()).label("Articles"),
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
            _id: item._id,
            articleId: item.articleId,
            quantite: item.quantite,
            code: item.articleId.code,
            nom: item.articleId.nom,
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
    if (prevState.startSearch !== this.state.startSearch) {
      let selectedLots = this.state.selecteDLots.map((c) => c._id);
      this.setState({ loadingArticles: true });
      let {
        data: { data: filteredArticles },
      } = await getArticles({
        sortColumn: this.state.sortColumn.path,
        order: this.state.sortColumn.order,
        searchQuery: this.state.searchQuery,
        selectedLots,
      });
      this.setState({
        filteredArticles,
        loadingArticles: false,
        startSearch: false,
      });
    }
    if (prevState.selecteDLots !== this.state.selecteDLots) {
      let selectedLots = this.state.selecteDLots.map((c) => c._id);
      if (selectedLots.length === 0) {
        this.setState({ filteredArticles: [] });
        return;
      }
      this.setState({ loadingArticles: true });
      let {
        data: { data: filteredArticles },
      } = await getArticles({
        sortColumn: this.state.sortColumn.path,
        order: this.state.sortColumn.order,
        searchQuery: this.state.searchQuery,
        selectedLots,
      });
      // fetch articles of selected lots
      this.setState({ filteredArticles, loadingArticles: false });
    }
  }
  handleSelectLot = (e, lot) => {
    let newSelectedLots = [...this.state.selecteDLots];
    const index = newSelectedLots.findIndex((c) => c._id === lot._id);
    if (index === -1) newSelectedLots.push(lot);
    else newSelectedLots.splice(index, 1);
    this.setState({ selecteDLots: newSelectedLots });
  };
  handleSelectArticle = (article) => {
    let newArticles = [...this.state.data.articles];
    const index = newArticles.findIndex((c) => {
      return c.articleId === article._id;
    });
    if (index === -1) {
      newArticles.push({
        articleId: article._id,
        quantite: 1,
        code: article.code,
        nom: article.nom,
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

  doSubmit = async () => {
    let { data } = this.state;
    await saveActeDentaire(data);
    this.setState({
      data: {
        nom: "",
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
    const {
      loadingArticles,
      filteredArticles,
      data,
      selecteDLots,
      searchQuery,
      selectedFields,
      fields,
      sortColumn,
    } = this.state;
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
              <div className="mt-2 flex w-full min-w-[320px] flex-wrap rounded-md ">
                <p className="m-2 mt-2 w-full text-base font-bold text-[#474a52]">
                  Articles à utiliser
                </p>
                {data.articles && data.articles.length > 0 ? (
                  <>
                    <table className="my-0 w-full">
                      <thead className="h-12 text-[#3d4255]">
                        <tr className="h-8 w-[100%] bg-[#83BCCD] text-center">
                          <th key={uuidv4()} className="w-8"></th>
                          <th
                            key={uuidv4()}
                            className="px-3 text-xs font-semibold text-[#2f2f2f]"
                          >
                            Code
                          </th>
                          <th
                            key={uuidv4()}
                            className="px-3 text-xs font-semibold text-[#2f2f2f]"
                          >
                            Désignation
                          </th>

                          <th
                            key={uuidv4()}
                            className="px-3 text-xs font-semibold text-[#2f2f2f]"
                          >
                            Qte à utiliser
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.articles.map((article) => {
                          return (
                            <tr
                              className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3] text-center"
                              key={article.articleId._id}
                            >
                              <td className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3] text-center">
                                <input
                                  type="checkbox"
                                  checked={true}
                                  onChange={() => {
                                    let articles = [...data.articles];
                                    const index = articles.findIndex(
                                      (c) =>
                                        c.articleId.toString() ===
                                        article.articleId.toString(),
                                    );
                                    articles.splice(index, 1);
                                    this.setState({
                                      data: { ...data, articles },
                                    });
                                  }}
                                />
                              </td>
                              <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                                {article.code}
                              </td>
                              <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                                {article.nom}
                              </td>
                              <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                                <Input
                                  type="number"
                                  width={80}
                                  fontWeight="medium"
                                  height={35}
                                  disabled={false}
                                  value={article.quantite}
                                  onChange={(e) => {
                                    let articles = [...data.articles];
                                    const index = articles.findIndex(
                                      (c) =>
                                        c.articleId.toString() ===
                                        article.articleId.toString(),
                                    );
                                    if (e.target.value >= 1) {
                                      articles[index].quantite = e.target.value;
                                      this.setState({
                                        data: { ...data, articles },
                                      });
                                    } else {
                                      articles[index].quantite = 1;
                                      this.setState({
                                        data: {
                                          ...data,
                                          articles,
                                        },
                                      });
                                    }
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <div className="ml-4">
                    <p className=" text-sm font-bold text-slate-900">
                      Aucun article séléctionné
                    </p>
                  </div>
                )}
              </div>
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
                <div className="my-2  flex flex-row items-start">
                  <div className="flex w-[30%] min-w-[320px]  flex-col rounded-md bg-[#F2F2F2]">
                    <p className="mb-2 rounded-md bg-[#4F6874] p-2 text-base font-bold text-white">
                      1. Recherche des articles
                    </p>
                    <div className="mb-2 flex">
                      <p className="m-2 mt-2 w-fit text-sm font-bold text-[#151516]">
                        a. chercher l'article
                      </p>
                      <SearchBox
                        value={searchQuery}
                        onChange={(e) => {
                          this.setState({ searchQuery: e });
                        }}
                        onSearch={() => this.setState({ startSearch: true })}
                      />
                    </div>
                    <div className="mb-2 mr-2 flex  flex-wrap ">
                      <p className="m-2 mt-2 w-full text-sm font-bold text-[#151516]">
                        b. Sélectionner les lots des articles
                      </p>
                      {datas.lots.map((lot) => {
                        return (
                          <div className={"mx-2  flex  w-max"} key={lot._id}>
                            <input
                              type="checkbox"
                              name={lot.nom}
                              id={lot.nom}
                              className="mx-1"
                              checked={
                                selecteDLots.find((c) => c._id === lot._id)
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleSelectLot(e, lot)}
                            />
                            <div className="items-center text-xs font-bold leading-9 text-[#1f2037]">
                              <label htmlFor="">{lot.nom}</label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mx-2 flex  min-w-[320px] flex-wrap rounded-md bg-[#4F6874]">
                    <p className="m-2 mt-2 w-full text-base font-bold text-white">
                      2. Sélectionner les arcticles à utiliser
                    </p>
                    {loadingArticles ? (
                      <div className="m-auto my-4">
                        <ClipLoader loading={loadingArticles} size={70} />
                      </div>
                    ) : filteredArticles.length > 0 ? (
                      <ArticlesTable
                        articles={filteredArticles}
                        sortColumn={sortColumn}
                        onSort={this.handleSort}
                        fields={fields}
                        datas={datas}
                        headers={selectedFields}
                        totalItems={filteredArticles.length}
                        onItemSelect={this.handleSelectArticle}
                        selectedItems={data.articles}
                        displayTableControlPanel={false}
                        displayItemActions={false}
                      />
                    ) : (
                      <div className="ml-4 ">
                        <p className="text-center text-sm font-bold text-slate-900">
                          Aucun article trouvé
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
