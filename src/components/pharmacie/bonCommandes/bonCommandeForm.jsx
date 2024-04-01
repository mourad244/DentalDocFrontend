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
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import BooleanButton from "../../../assets/buttons/boolanButton";
import Checkbox from "../../../common/checkbox";
import { getArticlesListWithPagination } from "../../../services/pharmacie/articleListPaginateService";
import { getArticles } from "../../../services/pharmacie/articleService";

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
    selecteDLots: [],
    filteredArticles: [],
    totalCount: 0,
    fields: [
      { order: 1, name: "select", label: "Select", isActivated: false },
      { order: 2, name: "nom", label: "Nom" },
      { order: 3, name: "code", label: "Code" },
      { order: 4, name: "lotId", label: "Lot" },
      { order: 5, name: "stockInitial", label: "Stock Initial" },
      { order: 6, name: "stockAlerte", label: "Stock Alerte" },
      { order: 7, name: "stockActuel", label: "Stock Actuel" },
      { order: 8, name: "uniteMesureId", label: "Unite Mesure" },
      { order: 9, name: "uniteReglementaireId", label: "Unite Reglementaire" },
      { order: 10, name: "prixHT", label: "Prix HT" },
      { order: 11, name: "tauxTVA", label: "Taux TVA" },
      { order: 12, name: "prixTTC", label: "Prix TTC" },
      { order: 13, name: "isExpiration", label: "Expiration" },
    ],
    selectedFields: [
      { order: 1, name: "select", label: "Select", isActivated: false },
      { order: 2, name: "nom", label: "Nom" },
      { order: 3, name: "code", label: "Code" },
      { order: 7, name: "stockActuel", label: "Stock Actuel" },
      { order: 8, name: "uniteMesureId", label: "Unite Mesure" },
      { order: 9, name: "uniteReglementaireId", label: "Unite Reglementaire" },
      { order: 12, name: "prixTTC", label: "Prix TTC" },
      { order: 13, name: "isExpiration", label: "Expiration" },
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
    // get the value of e
    // console.log(e.target.checked);
    let newSelectedLots = [...this.state.selecteDLots];
    const index = newSelectedLots.findIndex((c) => c._id === lot._id);
    if (index === -1) newSelectedLots.push(lot);
    else newSelectedLots.splice(index, 1);
    this.setState({ selecteDLots: newSelectedLots });
  };
  handleSelectArticle = (article) => {
    let articles = [...this.state.data.articles];
    const index = articles.findIndex((c) => c._id === article._id);
    if (index === -1) articles.push(article);
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
              1. Sélectionner les articles à commander
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

          <div className="flex w-[50%] min-w-[320px] flex-wrap">
            <p className="m-2 mt-2 w-full text-base font-bold text-[#151516]">
              2. Articles sélectionnés
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
              />
            )}
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
      </div>
    );
  }
}

export default BonCommandeForm;
