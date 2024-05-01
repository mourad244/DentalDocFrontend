import React from "react";
import Joi from "joi-browser";
import Form from "../../../common/form";

import { getLots } from "../../../services/pharmacie/lotService";
import {
  getReceptionBC,
  saveReceptionBC,
} from "../../../services/pharmacie/receptionBCService";
import { getUniteMesures } from "../../../services/pharmacie/uniteMesureService";
import { getUniteReglementaires } from "../../../services/pharmacie/uniteReglementaireService";
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { getBonCommande } from "../../../services/pharmacie/bonCommandeService";
import ArticleSelect from "../articles/articleSelect";

class ReceptionBCForm extends Form {
  state = {
    data: {
      bonCommandeId: "",
      numOrdre: "",
      date: "",
      commentaire: "",
      articles: [],
      images: [],
      imagesDeletedIndex: [],
      isLast: false,
    },
    datas: {
      lots: [],
      uniteMesures: [],
      uniteReglementaires: [],
    },
    totalCount: 0,
    articleFields: [
      { order: 1, name: "code", label: "Code" },
      { order: 2, name: "nom", label: "Désignation" },
      { order: 3, name: "quantiteTotal", label: "Quantité totale" },
      {
        order: 4,
        name: "quantite",
        label: "Qte reçu",
        isInput: true,
        isNumber: true,
      },
      {
        order: 5,
        name: "datePeremption",
        label: "Date expiration",
        isInput: true,
        isDate: true,
      },
    ],
    fields: [
      { order: 1, name: "select", label: "Select", isActivated: false },
      { order: 2, name: "nom", label: "Nom" },
      { order: 3, name: "code", label: "Code" },
      { order: 4, name: "lotId", label: "Lot" },
      { order: 5, name: "quantiteTotal", label: "Quantité totale" },
      { order: 6, name: "quantiteLivree", label: "Quantité livrée" },
    ],
    selectedFields: [
      { order: 1, name: "select", label: "Select", isActivated: false },
      { order: 2, name: "nom", label: "Nom" },
      { order: 3, name: "code", label: "Code" },
      { order: 4, name: "lotId", label: "Lot" },
      { order: 5, name: "quantiteTotal", label: "Quantité totale" },
      { order: 6, name: "quantiteLivree", label: "Quantité livrée" },
    ],
    sortColumn: { path: "nom", order: "asc" },
    currentPage: 1,
    searchQuery: "",
    pageSize: 8,
    errors: {},
    form: "receptionBCs",
    loading: false,
    loadingArticles: false,
  };
  schema = {
    _id: Joi.string(),
    bonCommandeId: Joi.string().required().label("Bon de commande"),
    numOrdre: Joi.string().allow("").allow(null).label("Numéro d'ordre"),
    date: Joi.date().required().label("Date"),
    commentaire: Joi.string().allow("").allow(null).label("Commentaire"),
    articles: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string(),
          articleId: Joi.object().label("Article"),
          quantite: Joi.number().min(1).required().label("Quantité"),
          code: Joi.string().required().label("Code"),
          nom: Joi.string().required().label("Nom"),
          quantiteTotal: Joi.number().required().label("Quantité totale"),
          isExpiration: Joi.boolean().label("isExpiration"),
          datePeremption: Joi.date().when("isExpiration", {
            is: true,
            then: Joi.date().required(),
            otherwise: Joi.date().allow("").allow(null),
          }),
        }),
      )
      .label("Articles"),
    images: Joi.label("Images").optional(),
    isLast: Joi.label("isLast").optional(),
    imagesDeletedIndex: Joi.label("imagesDeletedIndex").optional(),
  };

  async populateDatas() {
    this.setState({ loading: true });
    const { data: lots } = await getLots();
    const { data: uniteMesures } = await getUniteMesures();
    const { data: uniteReglementaires } = await getUniteReglementaires();
    const bonCommandeId = this.props.match.params.boncommandeid;
    const receptionBCId = this.props.match.params.receptionbcid;
    if (receptionBCId === "new" || receptionBCId === undefined) {
      if (bonCommandeId) {
        const { data: bonCommande } = await getBonCommande(bonCommandeId);
        let articles = bonCommande.articles.map((item) => {
          return {
            _id: item.articleId._id,
            articleId: item.articleId,
            code: item.articleId.code,
            nom: item.articleId.nom,
            quantite: 0,
            quantiteTotal: item.quantiteTotal,
            isExpiration: item.articleId.isExpiration,
            datePeremption: item.datePeremption
              ? item.datePeremption.split("T")[0]
              : "",
          };
        });
        this.setState({
          data: {
            ...this.state.data,
            articles,
            bonCommandeId: bonCommandeId,
          },
          datas: { lots, uniteMesures, uniteReglementaires },
          loading: false,
        });
      }
      return this.setState({
        datas: { lots, uniteMesures, uniteReglementaires },
        loading: false,
      });
    } else {
      const { data: receptionBC } = await getReceptionBC(receptionBCId);
      // get the : filteredSocietes from fetched receptionBC if existe
      /* 1.selecteDLots */
      receptionBC.articles = receptionBC.articles.map((item) => {
        // find the quantiteTotal of the article in the bonCommande
        const article = receptionBC.bonCommandeId.articles.find(
          (c) => c.articleId === item.articleId._id,
        );
        return {
          _id: item.articleId._id,
          articleId: item.articleId,
          code: item.articleId.code,
          nom: item.articleId.nom,
          quantite: item.quantite,
          isExpiration: item.articleId.isExpiration,
          quantiteTotal: article.quantiteTotal,
          datePeremption: item.datePeremption
            ? item.datePeremption.split("T")[0]
            : "",
        };
      });

      return this.setState({
        data: this.mapToViewModel(receptionBC),
        datas: { lots, uniteMesures, uniteReglementaires },
        loading: false,
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

    if (prevState.data !== this.state.data && this.props.onReceptionBCChange) {
      const { data } = this.state;
      this.props.onReceptionBCChange(data);
      // this.props.dataIsValid(this.validate() ? false : true);
    }
    // if selectedReceptionBC is updated
    if (
      prevProps.selectedReceptionBC &&
      this.props.selectedReceptionBC &&
      prevProps.selectedReceptionBC._id !== this.props.selectedReceptionBC._id
    ) {
      this.setState({
        data: this.mapToViewModel(this.props.selectedReceptionBC),
      });
    }
  }

  mapToViewModel(receptionBC) {
    return {
      _id: receptionBC._id,
      bonCommandeId: receptionBC.bonCommandeId._id,
      numOrdre: receptionBC.numOrdre,
      isLast: receptionBC.isLast,
      date: receptionBC.date,
      commentaire: receptionBC.commentaire,
      articles: receptionBC.articles,
      imagesDeletedIndex: [],
      images: receptionBC.images ? receptionBC.images : [],
    };
  }
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  doSubmit = async () => {
    let result = { ...this.state.data };
    this.setState({ loading: true });
    await saveReceptionBC(result);
    this.setState({ loading: false });
    if (this.props.match) this.props.history.push("/receptionbcs");
    else window.location.reload();
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
  render() {
    const { loading, data } = this.state;
    return loading ? (
      <div className="m-auto my-4">
        <ClipLoader loading={loading} size={70} />
      </div>
    ) : (
      <div
        className={`mt-1 h-[fit-content] w-[100%] min-w-fit rounded-tr-md ${"border border-white bg-white"}`}
      >
        {(!this.props ||
          (this.props && !this.props.selectedReceptionBC) ||
          (this.props.selectedReceptionBC &&
            !this.props.selectedReceptionBC._id)) && (
          <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
            Formulaire de réception du bon de commande
          </p>
        )}

        <div className="ml-2  flex justify-start ">
          <button
            className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
            onClick={() => {
              this.props.history.push("/receptionbcs");
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
          <ArticleSelect
            articles={data.articles}
            handleChangeItem={this.handleChangeItem}
            handleSelectArticle={this.handleSelectSelectedArticle}
            title="Liste des articles commandés"
            fields={this.state.articleFields}
          />

          <div className="flex w-[100%] flex-wrap justify-start">
            <div className="mt-3 ">
              {this.renderDate("date", "Date", 190, 35, 95)}
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
          <div className="mt-3">
            {this.renderBoolean(
              "isLast",
              "Dernière réception",
              "Oui",
              "Non",
              95,
              35,
              100,
            )}
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

export default ReceptionBCForm;
