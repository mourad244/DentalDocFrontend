import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
// import { CommissionEstimationDoc } from "../files/commissionEstimationDoc";
import "./fichePatient.css";
import logo from "../assets/images/logo-dental-doc.png";

const FichePatient = (props) => {
  const {
    nom,
    prenom,
    dateCreation,
    // cin,
    dateNaissance,
    fonction,
    telephone,
  } = props.data;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="print-content">
      <svg width="50" height="51" onClick={handlePrint}>
        <circle cx="25.0002" cy="17.2414" r="17.2414" fill="#474A52" />
        <path
          d="M21.0161 21.0772H29.36V22.7059H21.0161V21.0772Z"
          fill="white"
        />
        <path
          d="M21.0161 23.5682H26.9144V25.2448H21.0161V23.5682Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.6833 13.5804L17.6833 8.90983C17.8752 7.90387 18.7144 7.04161 19.6974 6.8979L23.7399 6.89791C25.9448 6.89791 28.2264 6.89791 30.4629 6.8979C31.398 6.85 32.6208 8.02363 32.6687 9.00563C32.7557 10.7901 32.6687 13.5804 32.6687 13.5804H33.9156C34.8267 13.5804 36.0015 14.8019 36.0015 15.6163V21.5562C36.0015 21.9395 35.374 22.9722 34.5629 23.3286C33.8601 23.6375 32.6688 23.5682 32.6688 23.5682V26.6741C32.6688 27.7519 31.398 28.5022 30.4389 28.5501C29.4194 28.5501 28.3778 28.555 27.2938 28.5601L27.2932 28.5601C24.9869 28.5709 22.4882 28.5827 19.6015 28.5501C19.0501 28.5439 17.6834 27.5381 17.6834 26.4663C17.6834 24.9574 17.6594 23.5442 17.6594 23.5442H16.3167C15.7173 23.5442 14.3266 22.5143 14.3267 21.173C14.3267 19.6144 14.3267 18.8298 14.3267 17.6293L14.3267 15.76C14.3267 14.7301 15.6452 13.5804 16.3886 13.5804H17.6833ZM20.0077 26.8256L30.3443 26.8256C30.5597 26.8256 30.9425 26.3234 30.9425 25.8571C30.9424 25.3908 30.9425 19.4006 30.9425 19.4006L19.3378 19.4006L19.3378 25.5701C19.3378 26.3951 19.7207 26.8256 20.0077 26.8256ZM19.9372 8.59846H30.2951C30.5828 8.59846 30.9665 8.88588 30.9665 9.43677V13.5564H19.3378C19.3378 13.5564 19.3378 9.55653 19.3378 9.24515C19.3378 8.93378 19.7214 8.59846 19.9372 8.59846ZM32.3091 17.724C33.0109 17.724 33.5799 17.1556 33.5799 16.4546C33.5799 15.7535 33.0109 15.1851 32.3091 15.1851C31.6073 15.1851 31.0384 15.7535 31.0384 16.4546C31.0384 17.1556 31.6073 17.724 32.3091 17.724Z"
          fill="white"
        />
        <text fill="#474A52" fontSize="12" fontWeight="500">
          <tspan x="0.507812" y="48.1709">
            Imprimer
          </tspan>
        </text>
      </svg>
      <div
        style={{
          display: "none",
        }}
      >
        <div className="doc" ref={componentRef}>
          <img className="image-doc" src={logo} alt={"logo-dgss"} />
          <div className="attache"></div>
          <h2 className="titreDoc"> FICHE DE PATIENT</h2>
          <div className="table-doc1">
            <table>
              <tbody>
                <tr>
                  <td>
                    Date Création:{"    "}
                    {new Date(dateCreation).getDate()}-
                    {new Date(dateCreation).getMonth()}-
                    {new Date(dateCreation).getFullYear()}
                  </td>
                </tr>
                <tr>
                  <td>Medecins:</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table-doc1 table-doc2">
            <table>
              <thead>
                <tr>
                  <th>PATIENT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nom: {nom.toUpperCase()}</td>
                </tr>
                <tr>
                  <td>Nom: {prenom.toUpperCase()}</td>
                </tr>
                <tr>
                  <td>
                    Date de Naissance: {new Date(dateNaissance).getDate()}-
                    {new Date(dateCreation).getMonth()}-
                    {new Date(dateCreation).getFullYear()}
                  </td>
                </tr>
                <tr>
                  <td>Fonction: {fonction.toUpperCase()}</td>
                </tr>
                <tr>
                  <td>N° Tél: {telephone}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FichePatient;
