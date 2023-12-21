import React, { useState } from "react";
import "../devis/menuDevi.css";
import { Link } from "react-router-dom";

const MenuPaiement = () => {
  const [url, setUrl] = useState(
    window.location.href.replace("http://localhost:3000/", "")
  );

  return (
    <nav className="menuDevi">
      <ul className="menuDevi-menu">
        <li
          className={
            url !== "ajouterpaiement"
              ? "menuDevi-item menuDevi-link"
              : "menuDevi-item menuDevi-link-active"
          }
        >
          <Link
            to="ajouterpaiement"
            onClick={() => {
              setUrl("ajouterpaiement");
              if (url === "ajouterpaiement") setUrl("ajouterpaiement");
            }}
          >
            Nouveau paiement
          </Link>
        </li>
        <li
          className={
            url !== "paiements"
              ? "menuDevi-link menuDevi-item"
              : "menuDevi-link-active menuDevi-item"
          }
        >
          <Link
            to="paiements"
            onClick={() => {
              setUrl("paiements");
            }}
          >
            Liste des paiements
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default MenuPaiement;
