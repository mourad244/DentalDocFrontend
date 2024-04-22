import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { ReactComponent as AccueilIconActive } from "../assets/icons/sidebar/accueil-active.svg";
import { ReactComponent as AccueilIcon } from "../assets/icons/sidebar/accueil.svg";
import { ReactComponent as PatientIconActive } from "../assets/icons/sidebar/patient-active.svg";
import { ReactComponent as PatientIcon } from "../assets/icons/sidebar/patient.svg";
import { ReactComponent as RdvIconActive } from "../assets/icons/sidebar/rdv-active.svg";
import { ReactComponent as RdvIcon } from "../assets/icons/sidebar/rdv.svg";
import { ReactComponent as DeviIconActive } from "../assets/icons/sidebar/devi-active.svg";
import { ReactComponent as DeviIcon } from "../assets/icons/sidebar/devi.svg";
import { ReactComponent as PaiementIconActive } from "../assets/icons/sidebar/paiement-active.svg";
import { ReactComponent as PaiementIcon } from "../assets/icons/sidebar/paiement.svg";
import { ReactComponent as SettingsIcon } from "../assets/icons/sidebar/settings.svg";
import { ReactComponent as SettingsIconActive } from "../assets/icons/sidebar/settings-active.svg";
import { ReactComponent as LivraisonIcon } from "../assets/icons/sidebar/livraison.svg";
import { ReactComponent as LivraisonIconActive } from "../assets/icons/sidebar/livraison-active.svg";
import { ReactComponent as CommandeIcon } from "../assets/icons/sidebar/commande.svg";
import { ReactComponent as CommandeIconActive } from "../assets/icons/sidebar/commande-active.svg";
import { ReactComponent as ArticleIcon } from "../assets/icons/sidebar/article.svg";
import { ReactComponent as ArticleIconActive } from "../assets/icons/sidebar/article-active.svg";

const NavBar = ({ user }) => {
  const location = useLocation();

  const [activeAccueil, setActiveAccueil] = useState(false);
  const [activePatient, setActivePatient] = useState(false);
  const [activeRdv, setActiveRdv] = useState(false);
  const [activeDevi, setActiveDevi] = useState(false);
  const [activePaiement, setActivePaiement] = useState(false);
  const [activeLivraison, setActiveLivraison] = useState(false);
  const [activeCommande, setActiveCommande] = useState(false);
  const [activeArticle, setActiveArticle] = useState(false);
  const [activeSettings, setActiveSettings] = useState(false);

  useEffect(() => {
    resetIcon();
    const path = location.pathname;
    if (path.includes("/accueil")) {
      setActiveAccueil(true);
    } else if (path.includes("/patients")) {
      setActivePatient(true);
    } else if (path.includes("/rdvs")) {
      setActiveRdv(true);
    } else if (path.includes("/devis")) {
      setActiveDevi(true);
    } else if (path.includes("/paiements")) {
      setActivePaiement(true);
    } else if (path.includes("/settings")) {
      setActiveSettings(true);
    } else if (path.includes("/livraisons")) {
      setActiveLivraison(true);
    } else if (path.includes("/boncommandes")) {
      setActiveCommande(true);
    } else if (path.includes("/articles")) {
      setActiveArticle(true);
    }
  }, [location]);

  const resetIcon = () => {
    setActiveAccueil(false);
    setActivePatient(false);
    setActiveRdv(false);
    setActiveDevi(false);
    setActivePaiement(false);
    setActiveSettings(false);
    setActiveLivraison(false);
    setActiveCommande(false);
    setActiveArticle(false);
  };

  return (
    <nav className="flex flex-col gap-2 bg-gradient-navbar ">
      {user.role === "admin" || user.role === "autorite" ? (
        <ul className="flex w-20">
          <li className=" m-auto my-1 w-fit">
            <Link
              // className=""
              to="/accueil"
              onClick={() => {
                resetIcon();
                setActiveAccueil(true);
              }}
            >
              {location.pathname.includes("accueil") || activeAccueil ? (
                <AccueilIconActive className="shadow-inner" />
              ) : (
                <AccueilIcon />
              )}
            </Link>
          </li>
        </ul>
      ) : null}
      {user.role === "admin" || user.role === "assistante" ? (
        <>
          <ul className="flex w-20">
            <li className=" m-auto my-1 w-fit">
              <Link
                className=""
                to="/patients"
                onClick={() => {
                  resetIcon();
                  setActivePatient(true);
                }}
              >
                {location.pathname.includes("patient") || activePatient ? (
                  <PatientIconActive />
                ) : (
                  <PatientIcon />
                )}
              </Link>
            </li>
          </ul>
          <ul className="flex w-20">
            <li className=" m-auto my-1 w-fit">
              <Link
                className=""
                to="/rdvs"
                onClick={() => {
                  resetIcon();
                  setActiveRdv(true);
                }}
              >
                {location.pathname.includes("rdv") || activeRdv ? (
                  <RdvIconActive />
                ) : (
                  <RdvIcon />
                )}
              </Link>
            </li>
          </ul>
        </>
      ) : null}
      {user.role === "admin" || user.role === "comptable" ? (
        <>
          <ul className="flex w-20">
            <li className=" m-auto my-1 w-fit">
              <Link
                className=""
                to="/devis"
                onClick={() => {
                  resetIcon();
                  setActiveDevi(true);
                }}
              >
                {location.pathname.includes("devi") || activeDevi ? (
                  <DeviIconActive />
                ) : (
                  <DeviIcon />
                )}
              </Link>
            </li>
          </ul>
          <ul className="flex w-20">
            <li className=" m-auto my-1 w-fit">
              <Link
                className=""
                to="/paiements"
                onClick={() => {
                  resetIcon();
                  setActivePaiement(true);
                }}
              >
                {location.pathname.includes("paiement") || activePaiement ? (
                  <PaiementIconActive />
                ) : (
                  <PaiementIcon />
                )}
              </Link>
            </li>
          </ul>
        </>
      ) : null}

      {user.role === "admin" ? (
        <>
          <ul className="flex w-20">
            <li className=" m-auto my-1 w-fit">
              <Link
                className=""
                to="/articles"
                onClick={() => {
                  resetIcon();
                  setActiveArticle(true);
                }}
              >
                {location.pathname.includes("article") || activeArticle ? (
                  <ArticleIconActive />
                ) : (
                  <ArticleIcon />
                )}
              </Link>
            </li>
          </ul>

          <ul className="flex w-20">
            <li className=" m-auto my-1 w-fit">
              <Link
                className=""
                to="/boncommandes"
                onClick={() => {
                  resetIcon();
                  setActiveCommande(true);
                }}
              >
                {location.pathname.includes("commande") || activeCommande ? (
                  <CommandeIconActive />
                ) : (
                  <CommandeIcon />
                )}
              </Link>
            </li>
          </ul>
          <ul className="flex w-20">
            <li className=" m-auto my-1 w-fit">
              <Link
                className=""
                to="/receptionbcs"
                onClick={() => {
                  resetIcon();
                  setActiveLivraison(true);
                }}
              >
                {location.pathname.includes("receptionbc") ||
                activeLivraison ? (
                  <LivraisonIconActive />
                ) : (
                  <LivraisonIcon />
                )}
              </Link>
            </li>
          </ul>
        </>
      ) : null}
      {user.role === "admin" ? (
        <>
          <ul className="flex w-20">
            <li className=" m-auto my-1 w-fit">
              <Link
                className=""
                to="/settings"
                onClick={() => {
                  resetIcon();
                  setActiveSettings(true);
                }}
              >
                {location.pathname.includes("settings") || activeSettings ? (
                  <SettingsIconActive />
                ) : (
                  <SettingsIcon />
                )}
              </Link>
            </li>
          </ul>
        </>
      ) : null}
    </nav>
  );
};
export default NavBar;
