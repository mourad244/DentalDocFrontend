import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
const Table = ({
  columns,
  sortColumn,
  onSort,
  data,
  addColumn,
  itemActions,
  onItemsSelect,
  tableControlPanel,
  selectedItems,
}) => {
  return (
    <>
      <div className="flex">{tableControlPanel}</div>
      {itemActions}
      <table className=" my-0 h-fit w-full">
        <TableHeader
          columns={columns}
          isAllSelectedItems={
            selectedItems && data.length === selectedItems.length && data.length
          }
          sortColumn={sortColumn}
          onItemsSelect={onItemsSelect}
          onSort={onSort}
        />

        <TableBody columns={columns} data={data} />
      </table>
    </>
  );
};

export default Table;
