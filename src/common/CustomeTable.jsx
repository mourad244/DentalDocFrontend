import React from "react";
import { v4 as uuidv4 } from "uuid";

const CustomeTable = ({
  sortColumn,
  onSort,
  data,
  addColumn,
  headers,
  tableRows,
  itemActions,
  onItemsSelect,
  totalItems,
  tableControlPanel,
  selectedItems,
  displayTableControlPanel = true,
  displayItemActions = true,
}) => {
  const raiseSort = (path) => {
    const newSortColumn = { ...sortColumn };
    if (newSortColumn.path === path)
      newSortColumn.order = newSortColumn.order === "asc" ? "desc" : "asc";
    else {
      newSortColumn.path = path;
      newSortColumn.order = "asc";
    }
    onSort(newSortColumn);
  };
  const tableHeaders = headers.map((header, index) => {
    if (header.label === "Select") {
      if (header.isActivated === false)
        return <th key={uuidv4()} className="w-8"></th>;
      return (
        <th
          key={uuidv4()}
          className="w-8"
          //   onClick={() => {
          //     return onSort(headers[index].name);
          //   }}
        >
          <input
            type="checkbox"
            checked={
              selectedItems && totalItems && totalItems === selectedItems.length
            }
            onChange={onItemsSelect}
          />
        </th>
      );
    } else
      return (
        <th
          key={uuidv4()}
          className="px-3 text-xs font-semibold text-[#2f2f2f]"
          onClick={() => {
            return raiseSort(headers[index].name);
          }}
        >
          {header.label}
        </th>
      );
  });
  return (
    <>
      {displayTableControlPanel && (
        <div className="flex">{tableControlPanel}</div>
      )}
      {displayItemActions && itemActions}
      <table className="my-0 w-full">
        <thead className="h-12  text-[#4f5361]">
          <tr className="h-8 w-[100%] bg-[#83BCCD] text-center">
            {tableHeaders.map((header, index) => {
              return header;
            })}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </>
  );
};

export default CustomeTable;
