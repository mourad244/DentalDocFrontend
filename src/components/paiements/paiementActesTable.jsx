import React from "react";
import Table from "../../common/table";
import Moment from "react-moment";

function PaiementActesTable(props) {
  const columns = [
    { path: "nature", label: "Nature Acte" },
    { path: "code", label: "Code Acte" },
    {
      path: "nom",
      label: "Description",
      content: (acte) => {
        // i want to fix the max length of the description to 20 characters
        if (acte.nom.length > 20) {
          return <p>{acte.nom.substring(0, 30)}...</p>;
        }
      },
    },
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
    { path: "prix", label: "Prix" },

    {
      path: "reste",
      label: "Reste",
      content: (acte) => {
        if (acte.reste) return <p>{acte.reste}</p>;
        else return <p>Payé</p>;
      },
    },
    // { path: "medecin", label: "Medecin" },
  ];

  const { actesEffectuees, onSort, sortColumn, totalDevis, totalPaiements } =
    props;
  const balance = totalDevis - totalPaiements;
  return (
    <div className="m-2 flex h-fit w-fit min-w-fit flex-col rounded-sm  bg-[#c4d8b4] shadow-custom ">
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
          <div className="flex justify-end border-t-2 border-black ">
            <p
              className={`${
                balance > 0 ? "bg-[#df6666]" : "bg-[#2bbb07]"
              } p-2 text-sm font-bold text-[#303233]`}
            >
              Balance: {totalDevis} - {totalPaiements} = {balance} Dh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaiementActesTable;
