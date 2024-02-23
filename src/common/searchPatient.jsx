import React, { useState } from "react";

import { searchPatient } from "../services/searchPatientService";

import SearchBox from "./searchBox";
import ClipLoader from "react-spinners/ClipLoader";

const SearchPatient = ({ onPatientSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundedPatients, setFoundedPatients] = useState([]);
  const [searchDone, setSearchDone] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div className="m-2 flex min-w-fit  rounded-sm bg-[#83BCCD] pb-2  pt-2 shadow-md ">
      <div className="mr-3 h-[40px] w-28 text-right text-xs font-bold leading-9 text-[#72757c]">
        Chercher un patient
      </div>
      <div className="flex w-fit items-start ">
        <SearchBox
          value={searchQuery}
          onChange={(e) => setSearchQuery(e)}
          onSearch={async () => {
            if (searchQuery) {
              setLoading(true);
              const { data: newFoundedPatients } =
                await searchPatient(searchQuery);
              setFoundedPatients(newFoundedPatients);
              setLoading(false);
              setSearchDone(true);
            }
          }}
        />

        {loading ? (
          <div className="mx-4">
            <ClipLoader loading={loading} size={30} />
          </div>
        ) : (
          <div className="mx-2 flex flex-wrap">
            {foundedPatients.length > 0
              ? foundedPatients.map((item) => (
                  <div
                    className=" w-fit cursor-pointer  items-center justify-between pl-2  hover:bg-[#e6e2d613]"
                    key={item._id}
                    onClick={() => {
                      onPatientSelect(item);
                      setSearchQuery("");
                      setFoundedPatients([]);
                      setSearchDone(false);
                    }}
                  >
                    <p className=" mb-1 w-max rounded-md bg-[#4F6874] p-2 text-xs font-bold leading-4 text-white">
                      {`${item.nom} ${item.prenom}`}
                    </p>
                  </div>
                ))
              : searchDone && (
                  <div className=" w-fit   items-center justify-between pl-2  ">
                    <p className=" mb-1 w-max rounded-md  p-2 text-xs font-bold leading-5 text-[#424746]">
                      Aucun patient trouvé
                    </p>
                  </div>
                )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPatient;
