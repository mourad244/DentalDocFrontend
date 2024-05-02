import React from "react";

import {
  getBonCommande,
  saveBonCommande,
} from "../../../services/pharmacie/bonCommandeService";
import { getLots } from "../../../services/pharmacie/lotService";
import { searchSociete } from "../../../services/pharmacie/searchSocieteService";
import { getUniteMesures } from "../../../services/pharmacie/uniteMesureService";
import { getUniteReglementaires } from "../../../services/pharmacie/uniteReglementaireService";

import Form from "../../../common/form";
import Input from "../../../common/input";
import SearchBox from "../../../common/searchBox";
import ArticleSearch from "../articles/articleSearch";

import Joi from "joi-browser";
import { v4 as uuidv4 } from "uuid";
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import ArticleSelect from "../articles/articleSelect";

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
    startSearch: false,
    selecteDSociete: {},
    startSearchSociete: false,
    articleFields: [
      {
        order: 1,
        name: "code",
        label: "Code",
      },
      {
        order: 2,
        name: "nom",
        label: "Désignation",
      },
      {
        order: 3,
        name: "prixTTC",
        label: "Prix unitaire",
        isNumber: true,
        isPrice: true,
      },
      {
        order: 4,
        name: "quantiteTotal",
        label: "Qte à commander",
        isNumber: true,
        isInput: true,
      },
      {
        order: 5,
        name: "prixTotal",
        label: "Prix Total",
        content: (article) => {
          let montant = article.prixTTC * article.quantiteTotal;
          return montant
            ? montant.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + " Dh"
            : "0 Dh";
        },
      },
    ],
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
    searchQuerySociete: "",
    searchQuery: "",
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
    tva: Joi.number().required().label("TVA"),
    commentaire: Joi.string().allow("").allow(null).label("Commentaire"),
    articles: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string(),
          articleId: Joi.object().label("Article"),
          code: Joi.string().required().label("Code"),
          nom: Joi.string().required().label("Nom"),
          quantiteTotal: Joi.number().min(1).required().label("Quantité"),
          prixTTC: Joi.number().required().label("Prix TTC"),
          lotId: Joi.string().required().label("Lot"),
        }),
      )
      .label("Articles"),
    images: Joi.label("Images").optional(),
    imagesDeletedIndex: Joi.label("imagesDeletedIndex").optional(),
  };

  async populateDatas() {
    this.setState({ loading: true });
    let { data: lots } = await getLots();
    const { data: uniteMesures } = await getUniteMesures();
    const { data: uniteReglementaires } = await getUniteReglementaires();
    // add is selected to lots
    lots = lots.map((lot) => {
      return { ...lot, isSelected: false };
    });
    const bonCommandeId = this.props.match.params.id;
    if (bonCommandeId === "new" || bonCommandeId === undefined) {
      return this.setState({
        datas: { lots, uniteMesures, uniteReglementaires },
        loading: false,
      });
    } else {
      const { data: bonCommande } = await getBonCommande(bonCommandeId);
      // get the : filteredSocietes from fetched bonCommande if existe
      /* 1.selecteDLots */
      let selectedLots = [];
      bonCommande.articles = bonCommande.articles.map((item) => {
        // item.articleId.lotId
        let lot = lots.find(
          (c) => c._id === (item.articleId && item.articleId.lotId),
        );
        if (lot) selectedLots.push(lot);

        //2 .filteredArticles,
        // return item add add
        return {
          _id: item.articleId._id,
          articleId: item.articleId,
          code: item.articleId.code,
          nom: item.articleId.nom,
          prixTTC: item.articleId.prixTTC,
          quantiteTotal: item.quantiteTotal,
          lotId: item.articleId.lotId,
        };
      });
      // 3. selecteSociete
      let selecteDSociete = bonCommande.societeRetenuId
        ? bonCommande.societeRetenuId
        : {};
      // make the selected lots selected
      lots = lots.map((lot) => {
        let index = selectedLots.findIndex((c) => c._id === lot._id);
        if (index !== -1) lot.isSelected = true;
        return lot;
      });
      return this.setState({
        data: this.mapToViewModel(bonCommande),
        datas: { lots, uniteMesures, uniteReglementaires },
        loading: false,
        selecteDSociete,
      });
    }
  }

  async componentDidMount() {
    await this.populateDatas();
    // this.props &&
    //   this.props.dataIsValid &&
    //   this.props.dataIsValid(this.validate() ? false : true);
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.formDisplay !== this.props.formDisplay) {
      this.setState({ formDisplay: this.props.formDisplay });
    }

    if (prevState.data !== this.state.data && this.props.onBonCommandeChange) {
      const { data } = this.state;
      this.props.onBonCommandeChange(data);
      // this.props.dataIsValid(this.validate() ? false : true);
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
    if (prevState.startSearchSociete !== this.state.startSearchSociete) {
      if (this.state.searchQuerySociete !== "") {
        this.setState({ loadingSocietes: true });
        let { data: filteredSocietes } = await searchSociete(
          this.state.searchQuerySociete,
        );
        this.setState({
          filteredSocietes,
          loadingSocietes: false,
          startSearchSociete: false,
        });
      }
    }
  }

  mapToViewModel(bonCommande) {
    return {
      _id: bonCommande._id,
      numOrdre: bonCommande.numOrdre,
      date: bonCommande.date,
      objet: bonCommande.objet,
      societeRetenuId:
        bonCommande.societeRetenuId && bonCommande.societeRetenuId
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
  handleChangeItem = (e, article, field) => {
    let newArticles = [...this.state.data.articles];
    const index = newArticles.findIndex(
      (c) => c.articleId === article.articleId,
    );
    newArticles[index][field] = e;
    this.setState({ data: { ...this.state.data, articles: newArticles } });
  };
  handleSelectSelectedArticle = (article) => {
    let newArticles = [...this.state.data.articles];
    const index = newArticles.findIndex(
      (c) => c.articleId === article.articleId,
    );
    newArticles.splice(index, 1);
    this.setState({ data: { ...this.state.data, articles: newArticles } });
  };
  handleSelectArticle = (article) => {
    let newArticles = [...this.state.data.articles];
    const index = newArticles.findIndex((c) => {
      return c.articleId._id === article._id;
    });
    if (index === -1)
      newArticles.push({
        articleId: article,
        code: article.code,
        nom: article.nom,
        prixTTC: article.prixTTC,
        quantiteTotal: 1,
        lotId: article.lotId,
      });
    else newArticles.splice(index, 1);
    this.setState({ data: { ...this.state.data, articles: newArticles } });
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
    const { datas, loading, data, searchQuerySociete } = this.state;
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
          className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-col justify-start"
          onSubmit={this.handleSubmit}
        >
          <ArticleSearch
            datas={datas}
            onSelectArticle={this.handleSelectArticle}
            selectedArticles={data.articles}
          />
          <ArticleSelect
            title="3. Valider les articles à commander"
            articles={data.articles}
            handleChangeItem={this.handleChangeItem}
            handleSelectArticle={this.handleSelectSelectedArticle}
            fields={this.state.articleFields}
          />

          {/* search societe */}
          {Object.keys(this.state.selecteDSociete).length === 0 && (
            <div>
              <p className="mr-2 mt-2 rounded-md bg-[#4F6874] p-2 text-base font-bold text-white">
                4. Choisir la société retenue
              </p>
              <div className="flex bg-[#F2F2F2] ">
                <div className="my-2 flex flex-row items-center">
                  <label className="m-2 h-fit w-[92px] text-xs font-bold text-[#72757c]">
                    Chercher société
                  </label>
                  <SearchBox
                    width={190}
                    value={searchQuerySociete}
                    onChange={(e) => {
                      this.setState({ searchQuerySociete: e });
                    }}
                    onSearch={() =>
                      this.setState({
                        startSearchSociete: true,
                      })
                    }
                  />
                </div>
                {this.state.loadingSocietes ? (
                  <div className="my-2 ml-4">
                    <ClipLoader
                      loading={this.state.loadingSocietes}
                      size={30}
                    />
                  </div>
                ) : (
                  <div className="mx-2 flex w-full flex-wrap">
                    {this.state.filteredSocietes.map((societe) => {
                      return (
                        <div
                          onClick={() => {
                            this.setState({
                              data: {
                                ...data,
                                societeRetenuId: societe._id,
                              },
                              selecteDSociete: societe,
                              filteredSocietes: [],
                              searchQuerySociete: "",
                            });
                          }}
                          key={societe._id}
                          className="m-2 cursor-pointer rounded-md bg-slate-400 p-2 text-xs font-bold shadow-md"
                        >
                          {societe.nom}
                          {societe.telephone
                            ? ` - N°:${societe.telephone}`
                            : ""}
                          {societe.ville ? ` - ${societe.ville}` : ""}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mt-2 flex w-full">
            <Input
              disabled={true}
              name="societeRetenuId"
              label="Société retenue"
              value={
                this.state.selecteDSociete && this.state.selecteDSociete.nom
                  ? this.state.selecteDSociete.nom
                  : ""
              }
              widthLabel={95}
              width={190}
            />
            {Object.keys(this.state.selecteDSociete).length !== 0 && (
              <button
                className="ml-2 rounded-md bg-red-500 p-2 text-xs font-bold text-white"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    selecteDSociete: {},
                    data: { ...data, societeRetenuId: "" },
                  });
                }}
              >
                X
              </button>
            )}
          </div>
          <div className="flex w-[100%] flex-wrap justify-start">
            <div className="mt-3 ">
              {this.renderDate("date", "Date", 190, 35, 95)}
            </div>
            <div className="mt-3 ">
              {this.renderInput("objet", "Objet", 190, 35, "text", 95)}
            </div>

            <div className="mt-3 ">
              {this.renderInput("tva", "TVA", 190, 35, "number", 95)}
            </div>

            <div className="mt-3 ">
              {this.renderInput(
                "commentaire",
                "Description",
                190,
                35,
                "text",
                95,
              )}
            </div>
          </div>

          <div className="mt-3 w-full">
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
