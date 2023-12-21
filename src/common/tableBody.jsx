import React from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { colorsNatureActe } from "../utils/colorsNatureActe";

function TableBody(props) {
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
            className=" h-12 bg-[#dedcf1]  text-center"
            style={
              colorsNatureActe[item.nature]
                ? { backgroundColor: colorsNatureActe[item.nature] }
                : {}
            }
          >
            {columns.map((column) => {
              return (
                <td
                  className="px-1 text-xs font-medium text-[#2f2f2f]"
                  key={createKey(item, column)}
                  //   className={
                  //     dangerTextValue(column.path, item[column.path])
                  //       ? "danger-text-value"
                  //       : alertTextValue(column.path, item[column.path])
                  //       ? "alert-text-value"
                  //       : ""
                  //   }
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

// function dangerTextValue(path, value) {
//   return (path = "nombrePersonnel" && value[0] <= 3) ||
//     (path = "autonomieBie" && value[0] <= 3) ||
//     ((path = "groupeEle" || "moyenReserve") && value === "aucun") ||
//     (path = "qualiteRadio" && value[0] <= 2)
//     ? true
//     : false;
// }

// function alertTextValue(path, value) {
//   return (path === "nombrePersonnel" && value[0] === 4) ||
//     (path === "autonomieBie" && value[0] === 4) ||
//     (path === "qualiteRadio" && value[0] === 3)
//     ? true
//     : false;
// }

export default TableBody;
