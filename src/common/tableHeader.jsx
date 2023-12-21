import React from "react";

function TableHeader(props) {
  const renderCell = (item, column) => {
    if (column.content) return column.content(item);
  };
  const raiseSort = (path) => {
    const sortColumn = { ...props.sortColumn };
    if (sortColumn.path === path)
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }
    props.onSort(sortColumn);
  };

  const renderSortIcon = (column) => {
    const { sortColumn } = props;
    if (column.path !== sortColumn.path) return null;
    if (sortColumn.order === "asc") return <i className="fa fa-sort-asc"></i>;
    return <i className="fa fa-sort-desc"></i>;
  };

  return (
    <thead className="h-12  text-[#4f5361]">
      <tr className="h-8 w-[100%] bg-[#869ad3] text-center">
        {props.columns.map((column) => {
          if (column.path === "select") {
            return (
              <th className="w-8" key={column.path}>
                <input
                  type="checkbox"
                  checked={props.isAllSelectedItems}
                  onChange={() => props.onItemsSelect()}
                />
              </th>
            );
          } else
            return (
              <th
                className="px-3 text-xs font-semibold text-[#2f2f2f]"
                key={column.path || column.key}
                onClick={() => raiseSort(column.path)}
              >
                {column.label}
                {renderSortIcon(column)}
              </th>
            );
        })}
      </tr>
    </thead>
  );
}

export default TableHeader;
