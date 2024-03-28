import React from "react";

const MenuSettings = ({ onSelectSetting, selectedSetting }) => {
  return (
    <nav className="mt-2  w-fit rounded-sm bg-[#83BCCD] p-2">
      <ul className="  flex flex-wrap ">
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("roles")
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
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
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
          }`}
          onClick={() => {
            onSelectSetting("medecins");
          }}
        >
          Medecins
        </li>
        {/* unite mesure */}
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("uniteMesures")
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
          }`}
          onClick={() => {
            onSelectSetting("uniteMesures");
          }}
        >
          Unités de mesures
        </li>
        {/* unite reglementaire */}
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("uniteReglementaires")
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
          }`}
          onClick={() => {
            onSelectSetting("uniteReglementaires");
          }}
        >
          Unités réglementaires
        </li>
        {/* lot */}
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("lots")
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
          }`}
          onClick={() => {
            onSelectSetting("lots");
          }}
        >
          Lots
        </li>
        {/* societes */}
        <li
          className={`mx-2 my-1  cursor-pointer  rounded-sm  p-1 text-xs font-bold  ${
            !selectedSetting.includes("societes")
              ? " bg-[#4F6874] text-white"
              : " bg-white text-[#4F6874]"
          }`}
          onClick={() => {
            onSelectSetting("societes");
          }}
        >
          Sociétés
        </li>
      </ul>
    </nav>
  );
};
export default MenuSettings;
