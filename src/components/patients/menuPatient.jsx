import React, { useState } from "react";

const MenuPatient = ({ toggleForm }) => {
  const [url, setUrl] = useState("");
  const inactiveButton =
    "mr-2 h-8 min-w-fit flex cursor-pointer list-none rounded-lg bg-[#455a94] pl-3 pr-3 pt-2 text-xs text-center font-bold text-white no-underline";
  const activeButton =
    "text-custom-blue h-8 min-w-fit shadow-custom rounded-custom mr-2 flex  cursor-pointer text-xs list-none bg-white pl-3  pr-3 pt-2 text-base font-bold no-underline";

  return (
    <nav className="mt-2 w-fit">
      <ul className="m-0 flex h-8 flex-row p-0">
        <li
          className={url !== "patients" ? inactiveButton : activeButton}
          onClick={() => {
            setUrl("patients");
            toggleForm(true);
          }}
        >
          Liste des dossiers
        </li>

        <li
          className={url !== "patientForm" ? inactiveButton : activeButton}
          onClick={() => {
            setUrl("patientForm");
            // if (url === "patientForm") setUrl("patients");
            toggleForm(false);
          }}
        >
          Nouveau dossier
        </li>
      </ul>
    </nav>
  );
};
export default MenuPatient;
