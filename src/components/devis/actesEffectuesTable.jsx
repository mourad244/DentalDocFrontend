import React from "react";
import Table from "../../common/table";
import Moment from "react-moment";
import { colorsNatureActe } from "../../utils/colorsNatureActe";
import "./actesEffectuesTable.css";
import SchemaDent from "../../assets/icons/graphs/schemaDent";

function ActesEffectuesTable(props) {
  const colors = colorsNatureActe;
  const columns = [
    // { path: "acte.", label: "N° Acte" },
    { path: "nature", label: "Nature Acte" },
    { path: "code", label: "Code Acte" },
    //array in table
    { path: "dents", label: "Dents" },
    { path: "nom", label: "Description" },
    {
      path: "date",
      label: "Date",
      date: (acte) => {
        if (acte.date !== undefined && acte.date !== null)
          return (
            <Moment date={acte.date} format="DD/MM/YYYY">
              {acte.date}
            </Moment>
          );
      },
    },
    { path: "medecin", label: "Medecin" },
  ];

  const { actesEffectuees, onSort, sortColumn } = props;
  let colorDents = {};
  actesEffectuees.map((item) => {
    if (item.dents.length !== 0)
      item.dents.split("-").map((e) => {
        if (e) {
          colorDents[e] = colors[item.nature];
        }
        return true;
      });
    return true;
  });
  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white ">
      <div className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Historique des actes effectués
      </div>
      <div className="m-2">
        <Table
          columns={columns}
          data={actesEffectuees}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <SchemaDent dents={colorDents} />
      </div>
    </div>
  );
}

export default ActesEffectuesTable;
