import React from "react";

const MenuSettings = ({ onSelectSetting, selectedSetting }) => {
  return (
    <nav className="mt-2  w-fit rounded-sm bg-[#5a6b99]">
      <ul className="  flex flex-wrap ">
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("roles")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("roles");
          }}
        >
          Rôles
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("users")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("users");
          }}
        >
          Utilisateurs
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("regions")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("regions");
          }}
        >
          Région
        </li>

        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("provinces")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("provinces");
          }}
        >
          Province
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("allergies")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("allergies");
          }}
        >
          Allergies
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("couvertures")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("couvertures");
          }}
        >
          Couvertures
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("detailCouvertures")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("detailCouvertures");
          }}
        >
          Détails couvertures
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("dents")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("dents");
          }}
        >
          Dents
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("categorieMedicaments")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("categorieMedicaments");
          }}
        >
          Categories medicaments
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("medicaments")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("medicaments");
          }}
        >
          Medicaments
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("pathologies")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("pathologies");
          }}
        >
          Pathologies
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("natureActes")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("natureActes");
          }}
        >
          Nature Actes
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("acteDentaires")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("acteDentaires");
          }}
        >
          Actes dentaires
        </li>
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("medecins")
              ? " bg-[#455A94] text-white"
              : " bg-white text-[#455A94]"
          }`}
          onClick={() => {
            onSelectSetting("medecins");
          }}
        >
          Medecins
        </li>
      </ul>
    </nav>
  );
};
export default MenuSettings;
