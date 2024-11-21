import React from "react";
import Table from "../../common/table";
import moment from "moment";

function PaiementEffectuesTable(props) {
  const columns = [
    {
      path: "date",
      label: "Date",
      date: (paiement) => {
        if (paiement.date !== undefined && paiement.date !== null)
          return moment(paiement.date).format("DD/MM/YYYY");
      },
    },
    {
      path: "mode",
      label: "Mode Paiement",
    },
    { path: "montant", label: "Montant" },
  ];

  const { paiements, onSort, sortColumn, totalPaiements } = props;
  return (
    <div className="m-2 flex h-fit w-fit min-w-fit flex-col rounded-sm  bg-[#c4d8b4] shadow-custom ">
      <div className="w-[100%] bg-[#98c573] p-2 text-xl font-bold text-[#474a52] ">
        Paiements effectués
      </div>
      <div className="m-2 flex justify-between">
        <div className="mr-2">
          {paiements.length !== 0 ? (
            <Table
              columns={columns}
              data={paiements}
              sortColumn={sortColumn}
              onSort={onSort}
            />
          ) : (
            <div className="flex h-fit items-center justify-center">
              <p className="text-sm font-bold text-[#303233]">
                Aucun paiement effectué
              </p>
            </div>
          )}
          {paiements.length !== 0 && (
            <div className="flex justify-end border-t-2 border-black">
              <p className=" m-2 text-sm font-bold text-[#303233]">
                Total: {totalPaiements} Dh
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaiementEffectuesTable;
