import React from "react";
import Table from "../../common/table";
import Moment from "react-moment";
import { colorsNatureActe } from "../../utils/colorsNatureActe";
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
    { path: "prix", label: "Prix" },
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
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-sm  bg-[#c4d8b4] shadow-custom ">
      <div className="w-[100%] bg-[#98c573] p-2 text-xl font-bold text-[#474a52] ">
        Historique des actes effectués
      </div>
      <div className="m-2 flex justify-between">
        <div className="mr-2">
          <Table
            columns={columns}
            data={actesEffectuees}
            sortColumn={sortColumn}
            onSort={onSort}
          />
        </div>
        <SchemaDent dents={colorDents} />
      </div>
    </div>
  );
}

export default ActesEffectuesTable;
