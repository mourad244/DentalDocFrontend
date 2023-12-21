import React, { useState } from "react";
import "../devis/menuDevi.css";
import { Link } from "react-router-dom";

const MenuReport = () => {
  const [url, setUrl] = useState(
    window.location.href.replace("http://localhost:3000/", "")
  );

  return (
    <nav className="menuDevi">
      <ul className="menuDevi-menu">
        <li
          className={
            url !== "ajouterreport"
              ? "menuDevi-item menuDevi-link"
              : "menuDevi-item menuDevi-link-active"
          }
        >
          <Link
            to="ajouterreport"
            onClick={() => {
              setUrl("ajouterreport");
              if (url === "ajouterreport") setUrl("ajouterreport");
            }}
          >
            Nouveau report
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default MenuReport;
