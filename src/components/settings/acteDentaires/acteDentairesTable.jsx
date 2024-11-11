import React from "react";
import Table from "../../../common/table";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
function DetailCouverturesTable(props) {
  const columns = [
    {
      path: "select",
      label: "Select",
      content: (item) => {
        return (
          <input
            type="checkbox"
            checked={selectedItems.findIndex((c) => c._id === item._id) !== -1}
            onChange={() => onItemSelect(item)}
          />
        );
      },
    },
    {
      path: "nom",
      label: "Nom",
    },
    {
      path: "abreviation",
      label: "Abreviation",
    },
    {
      path: "natureId.nom",
      label: "Nature Acte",
    },
    {
      path: "code",
      label: "Code",
    },
    {
      path: "prix",
      label: "Prix",
    },
    {
      path: "duree",
      label: "Durée",

      content: (item) => {
        return <label key={item._id}>{item.duree} min</label>;
      },
    },
    {
      path: "moments",
      label: "Moments",
      content: (item) => {
        return <label key={item._id}>{item.moments.join(", ")}</label>;
      },
    },
    // articles
    {
      path: "articles",
      label: "Articles",
      content: (item) => {
        return item.articles.map((article) => {
          return (
            <div key={article._id}>
              <label className="text-xs">
                <span className="text-[#2f2f2f]">
                  {`- (${article.quantite} ${
                    article.articleId.uniteMesureId
                      ? article.articleId.uniteMesureId.nom
                      : ""
                  })`}
                </span>
                {article.articleId.nom}{" "}
              </label>
            </div>
          );
        });
      },
    },
  ];

  const {
    acteDentaires,
    onSort,
    onEdit,
    onItemSelect,
    onItemsSelect,
    sortColumn,
    selectedItem,
    selectedItems,
    onDelete,
  } = props;
  const itemActions = (
    <div className="m-1 mt-2 flex h-7 w-full items-center gap-2 rounded-md  border-slate-300 bg-[#D6E1E3] shadow-md ">
      <AiTwotoneEdit
        className={`h-6 w-7 cursor-pointer rounded-md  p-1  shadow-md  ${
          onEdit === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={onEdit}
        title="Modifier"
      />
      {/*  <GrFormView
        className="  h-6 w-7 cursor-pointer rounded-md  "
        onClick={onViewDetails}
      /> */}
      <AiFillDelete
        className={`h-6 w-7 cursor-pointer rounded-md   p-1 shadow-md  ${
          onDelete === undefined ? "pointer-events-none opacity-50 " : ""
        }`}
        onClick={() => {
          window.confirm("Confirmer la suppression") && onDelete(selectedItems);
        }}
        title="Supprimer"
      />
    </div>
  );
  return (
    <Table
      columns={columns}
      data={acteDentaires}
      onItemsSelect={onItemsSelect}
      selectedItems={selectedItems}
      selectedItem={selectedItem}
      sortColumn={sortColumn}
      onSort={onSort}
      itemActions={itemActions}
    />
  );
}

export default DetailCouverturesTable;
