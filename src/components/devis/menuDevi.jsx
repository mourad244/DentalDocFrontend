import React, { useState } from "react";
import "./menuDevi.css";
import { Link } from "react-router-dom";

const MenuDevi = () => {
  const [url, setUrl] = useState(
    window.location.href.replace("http://localhost:3000/", "")
  );

  return (
    <nav className="menuDevi">
      <ul className="menuDevi-menu">
        <li
          className={
            url !== "ajouterdevi"
              ? "menuDevi-item menuDevi-link"
              : "menuDevi-item menuDevi-link-active"
          }
        >
          <Link
            to="ajouterdevi"
            onClick={() => {
              setUrl("ajouterdevi");
              if (url === "ajouterdevi") setUrl("ajouterdevi");
            }}
          >
            Nouveau devi
          </Link>
        </li>
        <li
          className={
            url !== "devis"
              ? "menuDevi-link menuDevi-item"
              : "menuDevi-link-active menuDevi-item"
          }
        >
          <Link
            to="devis"
            onClick={() => {
              setUrl("devis");
            }}
          >
            Liste des devis
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default MenuDevi;
