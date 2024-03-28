import React, { useState, useEffect } from "react";

import Users from "./users/users";
import Dents from "./dents/dents";
import Roles from "./roles/roles";
import Lots from "./lots/lots";
import Regions from "./regions/regions";
import MenuSettings from "./menuSettings";
import Medecins from "./medecins/medecins";
import Provinces from "./provinces/provinces";
import Allergies from "./allergies/allergies";
import Pathologies from "./pathologies/pathologies";
import Medicaments from "./medicaments/medicaments";
import Couvertures from "./couvertures/couvertures";
import NatureActes from "./natureActes/natureActes";
import UniteMesures from "./uniteMesures/uniteMesures";
import ActeDentaires from "./acteDentaires/acteDentaires";
import Societes from "./societes/societes";
import DetailCouvertures from "./detailCouvertures/detailCouvertures";
import UniteReglementaires from "./uniteReglementaires/uniteReglementaires";
import CategorieMedicaments from "./categorieMedicaments/categorieMedicaments";

function Settings() {
  const [selectedSetting, setSelectedSetting] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  useEffect(() => {
    const updateSelectedComponent = () => {
      switch (selectedSetting) {
        case "roles":
          return setSelectedComponent(<Roles />);
        case "dents":
          return setSelectedComponent(<Dents />);
        case "users":
          return setSelectedComponent(<Users />);
        case "medecins":
          return setSelectedComponent(<Medecins />);
        case "allergies":
          return setSelectedComponent(<Allergies />);
        case "medicaments":
          return setSelectedComponent(<Medicaments />);
        case "couvertures":
          return setSelectedComponent(<Couvertures />);
        case "pathologies":
          return setSelectedComponent(<Pathologies />);
        case "natureActes":
          return setSelectedComponent(<NatureActes />);
        case "acteDentaires":
          return setSelectedComponent(<ActeDentaires />);
        case "detailCouvertures":
          return setSelectedComponent(<DetailCouvertures />);
        case "categorieMedicaments":
          return setSelectedComponent(<CategorieMedicaments />);
        case "regions":
          return setSelectedComponent(<Regions />);
        case "provinces":
          return setSelectedComponent(<Provinces />);
        case "lots":
          return setSelectedComponent(<Lots />);
        case "uniteMesures":
          return setSelectedComponent(<UniteMesures />);
        case "uniteReglementaires":
          return setSelectedComponent(<UniteReglementaires />);
        case "societes":
          return setSelectedComponent(<Societes />);
        default:
          return setSelectedComponent(<Roles />);
      }
    };
    updateSelectedComponent();
  }, [selectedSetting]);

  const onSelectSetting = (setting) => {
    setSelectedSetting(setting);
  };

  return (
    <div className=" mr-2 w-full ">
      <MenuSettings
        selectedSetting={selectedSetting}
        onSelectSetting={onSelectSetting}
      />
      {selectedComponent}
    </div>
  );
}

export default Settings;
