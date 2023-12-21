import React, { useState } from "react";
import "../devis/menuDevi.css";
import { Link } from "react-router-dom";

const MenuRdv = () => {
  const [url, setUrl] = useState(
    window.location.href.replace("http://localhost:3000/", "")
  );

  return (
    <nav className="menuDevi">
      <ul className="menuDevi-menu">
        <li
          className={
            url !== "ajouterrdv"
              ? "menuDevi-item menuDevi-link"
              : "menuDevi-item menuDevi-link-active"
          }
        >
          <Link
            to="ajouterrdv"
            onClick={() => {
              setUrl("ajouterrdv");
              if (url === "ajouterrdv") setUrl("ajouterrdv");
            }}
          >
            Nouveau RDV
          </Link>
        </li>
        <li
          className={
            url !== "rdvs"
              ? "menuDevi-link menuDevi-item"
              : "menuDevi-link-active menuDevi-item"
          }
        >
          <Link
            to="rdvs"
            onClick={() => {
              setUrl("rdvs");
            }}
          >
            Liste des RDVs
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MenuRdv;
