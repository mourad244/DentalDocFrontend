import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";

import { getLots } from "../../../services/pharmacie/lotService";
import {
  getBonCommande,
  saveBonCommande,
} from "../../../services/pharmacie/bonCommandeService";
import { getUniteMesures } from "../../../services/pharmacie/uniteMesureService";
import { getUniteReglementaires } from "../../../services/pharmacie/uniteReglementaireService";
import ArticlesTable from "../articles/articlesTable";
import { searchSociete } from "../../../services/pharmacie/searchSocieteService";
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { getArticlesListWithPagination } from "../../../services/pharmacie/articleListPaginateService";
import { getArticles } from "../../../services/pharmacie/articleService";
import SearchBox from "../../../common/searchBox";
import { v4 as uuidv4 } from "uuid";
import Input from "../../../common/input";

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
    datas: {
      lots: [],
      uniteMesures: [],
      uniteReglementaires: [],
    },
    filteredArticles: [],
    filteredSocietes: [],
    selecteDLots: [],
    startSearch: false,
    selectedSociete: {},
    startSearchSociete: false,
    totalCount: 0,
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
      { order: 12, name: "prixTTC", label: "Prix TTC" },
      { order: 13, name: "stockActuel", label: "Stock Actuel" },
    ],
    sortColumn: { path: "nom", order: "asc" },
    currentPage: 1,
    searchQuery: "",
    pageSize: 8,
    errors: {},
    form: "bonCommandes",
    loading: false,
    loadingArticles: false,
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
    const { data: uniteMesures } = await getUniteMesures();
    const { data: uniteReglementaires } = await getUniteReglementaires();
    this.setState({ datas: { lots, uniteMesures, uniteReglementaires } });
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
    if (prevState.searchQuerySociete !== this.state.searchQuerySociete) {
      if (this.state.searchQuerySociete !== "") {
        this.setState({ loadingSocietes: true });
        let { data: filteredSocietes } = await searchSociete(
          this.state.searchQuerySociete,
        );
        this.setState({ filteredSocietes, loadingSocietes: false });
      }
    }
    if (prevState.startSearch !== this.state.startSearch) {
      let selectedLots = this.state.selecteDLots.map((c) => c._id);

      this.setState({ loadingArticles: true });
      let {
        data: { data: filteredArticles, totalCount },
      } = await getArticles({
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        sortColumn: this.state.sortColumn.path,
        order: this.state.sortColumn.order,
        searchQuery: this.state.searchQuery,
        selectedLots,
      });
      // fetch articles of selected lots
      this.setState({
        filteredArticles,
        totalCount,
        loadingArticles: false,
        startSearch: false,
      });
    }
    if (prevState.selecteDLots !== this.state.selecteDLots) {
      let selectedLots = this.state.selecteDLots.map((c) => c._id);

      this.setState({ loadingArticles: true });
      let {
        data: { data: filteredArticles, totalCount },
      } = await getArticles({
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        sortColumn: this.state.sortColumn.path,
        order: this.state.sortColumn.order,
        searchQuery: this.state.searchQuery,
        selectedLots,
      });
      // fetch articles of selected lots
      this.setState({ filteredArticles, totalCount, loadingArticles: false });
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
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  handleSelectLot = (e, lot) => {
    e.preventDefault();
    let newSelectedLots = [...this.state.selecteDLots];
    const index = newSelectedLots.findIndex((c) => c._id === lot._id);
    if (index === -1) newSelectedLots.push(lot);
    else newSelectedLots.splice(index, 1);
    this.setState({ selecteDLots: newSelectedLots });
  };
  handleSelectArticle = (article) => {
    let articles = [...this.state.data.articles];
    const index = articles.findIndex((c) => c._id === article.articleId);
    if (index === -1)
      articles.push({
        articleId: article._id,
        code: article.code,
        nom: article.nom,
        prixTTC: article.prixTTC,
        quantiteTotal: 1,
      });
    else articles.splice(index, 1);
    this.setState({ data: { ...this.state.data, articles } });
  };

  doSubmit = async () => {
    let result = { ...this.state.data };
    this.setState({ loading: true });
    await saveBonCommande(result);
    this.setState({ loading: false });
    if (this.props.match) this.props.history.push("/boncommandes");
    else window.location.reload();
  };

  render() {
    const {
      datas,
      loading,
      loadingArticles,
      filteredArticles,
      data,
      selecteDLots,
    } = this.state;

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

        <div className="ml-2  flex justify-start ">
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

        <form
          className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
          onSubmit={this.handleSubmit}
        >
          <div className="flex w-[50%] min-w-[320px] flex-wrap bg-[#F2F2F2]">
            <p className="m-2 mt-2 w-full text-base font-bold text-[#151516]">
              1. Sélectionner les lots des articles
            </p>
            {datas.lots.map((lot) => {
              return (
                <div className={"mx-2 flex h-8 w-max"} key={lot._id}>
                  <input
                    type="checkbox"
                    name={lot.nom}
                    id={lot.nom}
                    className="mx-1"
                    checked={
                      selecteDLots.find((c) => c._id === lot._id) ? true : false
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
          <div className="flex w-fit items-start ">
            <SearchBox
              value={this.state.searchQuery}
              onChange={(e) => {
                this.setState({ searchQuery: e });
              }}
              onSearch={() =>
                this.setState({ startSearch: true, currentPage: 1 })
              }
            />
          </div>
          <div className="flex w-[50%] min-w-[320px] flex-wrap">
            <p className="m-2 mt-2 w-full text-base font-bold text-[#151516]">
              2. Sélectionner les arcticles à commander
            </p>
            {loadingArticles ? (
              <div className="m-auto my-4">
                <ClipLoader loading={loadingArticles} size={70} />
              </div>
            ) : (
              <ArticlesTable
                articles={filteredArticles}
                sortColumn={this.state.sortColumn}
                onSort={this.handleSort}
                fields={this.state.fields}
                datas={datas}
                headers={this.state.selectedFields}
                totalItems={this.state.filteredArticles.length}
                onItemSelect={this.handleSelectArticle}
                selectedItems={data.articles}
                displayTableControlPanel={false}
                displayItemActions={false}
              />
            )}
          </div>
          {/* 
          code, nom, prixTTC, qta a commander, prixTotal
          */}
          <p className="m-2 mt-2 w-full text-base font-bold text-[#151516]">
            3. Valider les articles à commander
          </p>
          <table className="my-0 w-full">
            <thead className="h-12 text-[#4f5361]">
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
                  Prix unitaire
                </th>
                <th
                  key={uuidv4()}
                  className="px-3 text-xs font-semibold text-[#2f2f2f]"
                >
                  Qte à commander
                </th>
                <th
                  key={uuidv4()}
                  className="px-3 text-xs font-semibold text-[#2f2f2f]"
                >
                  Prix Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.articles.map((article) => {
                return (
                  <tr
                    className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3] text-center"
                    key={article.articleId}
                  >
                    <td className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3] text-center">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => {}}
                      />
                    </td>
                    <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                      {article.code}
                    </td>
                    <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                      {article.nom}
                    </td>
                    <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                      {/* {article.prixTTC} */}
                      {/* faire le prix dans cet format : ex: 123 344,00 Dh, 123,00 Dh */}
                      {article.prixTTC
                        ? article.prixTTC.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) + " Dh"
                        : "0 Dh"}
                    </td>
                    <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                      <Input
                        type="number"
                        width={80}
                        fontWeight="medium"
                        height={35}
                        disabled={false}
                        value={article.quantiteTotal}
                        onChange={(e) => {
                          let articles = [...data.articles];
                          const index = articles.findIndex(
                            (c) =>
                              c.articleId.toString() ===
                              article.articleId.toString(),
                          );
                          if (e.target.value >= 1) {
                            articles[index].quantiteTotal = e.target.value;
                            this.setState({ data: { ...data, articles } });
                          } else {
                            articles[index].quantiteTotal = 1;
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
                    <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                      {article.prixTTC
                        ? (
                            article.prixTTC * article.quantiteTotal
                          ).toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) + " Dh"
                        : "0 Dh"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* ajouter une ligne séparant la table du reste de contenu  */}
          <div className="mt-2 h-1 w-full bg-[#1b1b1b]" />
          {/* ajouter le total des articls a gauches et montant total a droite */}
          <div className="flex w-full justify-between">
            <div className="flex  justify-start">
              <p className="my-2 mt-2 w-full min-w-max text-base font-bold text-[#151516]">
                Total des articles:
              </p>
              {/* calculer le nombre total des articles */}
              <p className="m-2 mt-2 w-full text-base font-bold text-[#151516]">
                {data.articles.length}
              </p>
            </div>
            <div className="flex  justify-end">
              <p className="m-2 mt-2 min-w-fit text-base font-bold text-[#151516]">
                Montant Total:
              </p>
              {/* calculer le montant total des articles */}
              <p className="m-2 mt-2 min-w-fit text-base font-bold text-[#151516]">
                {data.articles
                  .reduce((a, b) => a + b.prixTTC * b.quantiteTotal, 0)
                  .toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) + " Dh"}
              </p>
            </div>
          </div>
          {/* search societe */}
          <SearchBox
            value={this.state.searchQuerySociete}
            onChange={(e) => {
              this.setState({ searchQuerySociete: e });
            }}
            onSearch={() =>
              this.setState({ startSearchSociete: true, currentPage: 1 })
            }
          />
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
