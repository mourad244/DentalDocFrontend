import React from "react";
import Table from "../../common/table";
import Moment from "react-moment";

function PaiementActesTable(props) {
  const columns = [
    { path: "nature", label: "Nature Acte" },
    { path: "code", label: "Code Acte" },
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

  const { actesEffectuees, onSort, sortColumn, totalDevis } = props;

  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-sm  bg-[#c4d8b4] shadow-custom ">
      <div className="w-[100%] bg-[#98c573] p-2 text-xl font-bold text-[#474a52] ">
        Paiement des actes effectués
      </div>
      <div className="m-2 flex justify-between">
        <div className="mr-2">
          <Table
            columns={columns}
            data={actesEffectuees}
            sortColumn={sortColumn}
            onSort={onSort}
          />
          <div className="flex justify-end border-t-2 border-black">
            <p className="mr-3 text-sm font-bold text-[#303233]">
              {totalDevis} Dh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaiementActesTable;
