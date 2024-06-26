import React from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

function RdvTableBody(props) {
  const renderCell = (item, column) => {
    if (column.date) return column.date(item);
    if (column.content) return column.content(item);
    return _.get(item, column.path);
  };

  const createKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  const { data, columns } = props;
  return (
    <tbody>
      {data.map((item) => {
        return (
          <tr
            key={item._id || uuidv4()}
            className={`h-12 ${
              item.isAnnule
                ? "bg-[#ff8c8c]"
                : item.isReporte
                ? "bg-[#e49012]"
                : "bg-[#D6E1E3]"
            }  text-center`}
          >
            {columns.map((column) => {
              return (
                <td
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                  key={createKey(item, column)}
                >
                  {renderCell(item, column)}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

export default RdvTableBody;
