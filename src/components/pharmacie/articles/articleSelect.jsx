import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "../../../common/input";

function ArticleSelect(props) {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    setArticles(props.articles);
  }, [props.articles]);
  const handleSelectArticle = (article) => {
    props.handleSelectArticle(article);
  };
  const handleQuantityChange = (e, article) => {
    let newArticles = [...articles];
    const index = newArticles.findIndex(
      (selectedArticle) => selectedArticle.articleId === article.articleId,
    );
    if (e.target.value >= 1) {
      newArticles[index].quantite = e.target.value;
      setArticles(newArticles);
    } else {
      newArticles[index].quantite = 1;
      setArticles(newArticles);
    }
    props.handleQuantityChange(e.target.value, article);
  };
  return (
    <div className="mt-2 flex w-full min-w-[320px] flex-wrap rounded-md ">
      <p className="m-2 mt-2 w-full text-base font-bold text-[#474a52]">
        Articles à utiliser
      </p>
      {articles && articles.length > 0 ? (
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
            {articles.map((article) => {
              return (
                <tr
                  className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3] text-center"
                  key={article.articleId._id || article.articleId}
                >
                  <td className="h-12 border-y-2 border-y-gray-300 bg-[#D6E1E3] text-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {
                        handleSelectArticle(article);
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
                        handleQuantityChange(e, article);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="ml-4">
          <p className=" text-sm font-bold text-slate-900">
            Aucun article séléctionné
          </p>
        </div>
      )}
      <div />
    </div>
  );
}

export default ArticleSelect;
