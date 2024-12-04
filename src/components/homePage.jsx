import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import auth from "../services/authService";
const apiUrl = import.meta.env.VITE_API_URL;

import icondental from "../assets/icons/icon-dental.png";
import mongodbicon from "../assets/icons/mongodb.png";
import reacticon from "../assets/icons/react.png";
import nodejsicon from "../assets/icons/nodejs.svg";
import awsicon from "../assets/icons/aws.png";
import gestion_actes from "/images/gestion_actes.png";
import gestion_articles from "/images/gestion_articles.png";
import gestion_patients from "/images/gestion_patients.png";
import gestion_paiements from "/images/gestion_paiements.png";
import gestion_rdvs from "/images/gestion_rdvs.png";
import mutuelle from "/images/mutuelle1.jpg";

const FeatureCard = ({ title, description, imageSrc }) => {
  return (
    <div className="col-span-2 rounded-lg bg-[#F8F7F1] p-8 shadow-login transition-all duration-300 hover:shadow-lg lg:col-span-1">
      <h3 className="mb-6 text-2xl font-semibold text-[#424746]">{title}</h3>
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={imageSrc}
          alt={title}
          className="h-[300px] w-full transform object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <p className="mt-6 text-lg text-[#1f2037]">{description}</p>
    </div>
  );
};

const HomePage = ({ isLogged, user }) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const handleDemoClick = async () => {
    if (!user) {
      setLoading(true);
      try {
        await auth.login("visiteur", "visiteur"); // Log in with predefined credentials
        isLogged(); // Notify App that the user is logged in
        history.push("/accueil"); // Redirect to /accueil
      } catch (error) {
        console.error("Login failed", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-login-background">
      {/* Hero Section */}
      <header className="py-12 text-white">
        <div className="m-auto flex flex-col items-center">
          <img
            className="mb-5 h-20"
            src={icondental}
            // src={require("../assets/icons/icon-dental.png")}
            alt="Dental Doc Icon"
          />
          <h1 className="text-center text-5xl font-bold text-[#424746]">
            Dental Doc
          </h1>
          <p className="mt-2 text-center text-xl text-[#424746]">
            Simplifiez la gestion de votre cabinet dentaire
          </p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          {apiUrl.includes("demo") ? (
            <button
              onClick={handleDemoClick}
              className="w-44 rounded-login bg-authenfier-button p-1 text-center text-sm font-medium leading-7 text-white shadow-login-button transition hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Découvrir la démo"}
            </button>
          ) : (
            <>
              <Link
                className="w-44 rounded-login bg-authenfier-button p-1 text-center text-sm font-medium leading-7 text-white shadow-login-button transition hover:shadow-lg"
                to="/login"
              >
                Se connecter
              </Link>
              <a
                href="https://demo.dentaldocma.com"
                className="w-44 rounded-login bg-grey-ea p-1 text-center text-sm font-medium leading-7 text-grey-c0 shadow-login-button transition hover:shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Découvrir la démo
              </a>
            </>
          )}
        </div>
      </header>
      {/*  */}
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="mb-10 text-3xl font-bold text-[#424746]">
            Pourquoi choisir DentalDocMa ?
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Gestion des patients"
              description="Gérez les informations des patients, effectuez des recherches rapides et scannez des documents importants (CIN, mutuelles...)."
              imageSrc={gestion_patients}
            />
            <FeatureCard
              title="Gestion des rendez-vous"
              description="Organisez les rendez-vous avec précision, allouez un moment spécifique pour chaque acte."
              imageSrc={gestion_rdvs}
              // imageSrc="/images/rdvs_screenshot.png"
            />
            <FeatureCard
              title="Gestion des actes dentaires"
              description="Suivez les actes réalisés pour chaque patient et assurez une traçabilité complète."
              imageSrc={gestion_actes}
              // imageSrc="/images/actes_screenshot.png"
            />
            <FeatureCard
              title="Génération de mutuelles"
              description="Créez des documents de mutuelle automatiquement, prêts à être partagés avec vos patients."
              imageSrc={mutuelle}
              // imageSrc="/images/mutuelles_screenshot.png"
            />
            <FeatureCard
              title="Gestion des paiements"
              description="Suivez les paiements des patients avec des rapports clairs et détaillés."
              imageSrc={gestion_paiements}
              // imageSrc="/images/paiements_screenshot.png"
            />
            <FeatureCard
              title="Gestion des articles"
              description="Gardez un œil sur les articles utilisés dans les actes dentaires, et gérez leur disponibilité."
              imageSrc={gestion_articles}
              // imageSrc="/images/articles_screenshot.png"
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      {/* <section className="bg-[#F8F7F1] py-12">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-2xl font-bold text-[#424746]">
            Essayez notre démo interactive
          </h2>
          <p className="mb-8 text-[#1f2037]">
            Découvrez comment DentalDoc peut transformer la gestion de votre
            cabinet avec une version d'essai.
          </p>
          <a
            href="https://demo.dentaldocma.com"
            className="w-44 rounded-login bg-grey-ea p-1 text-center text-sm font-medium leading-7 text-grey-c0 shadow-login-button transition hover:shadow-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Découvrir la démo
          </a>
        </div>
      </section> */}

      {/* Technologies Section */}
      <section className="bg-[#95b0bb] py-12">
        <div className="container mx-auto  text-center">
          <h2 className="mb-6 text-2xl font-bold text-[#424746]">
            Technologies utilisées
          </h2>
          <div className="flex justify-center space-x-6">
            <img src={reacticon} alt="React" className="h-10" />
            <img src={nodejsicon} alt="Node.js" className="h-10 " />
            <img src={mongodbicon} alt="MongoDB" className="h-10 " />
            <img src={awsicon} alt="AWS" className="h-10 " />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#424746] py-6 text-white">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} DentalDoc. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
