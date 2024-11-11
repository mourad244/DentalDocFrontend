import ReactModal from "react-modal";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { getDents } from "../../services/dentService";
import { getRegions } from "../../services/regionService";
import { getPatientRdvs } from "../../services/rdvService";
import { getMedecins } from "../../services/medecinService";
import { getProvinces } from "../../services/provinceService";
import { saveDeviIsCovered } from "../../services/deviService";
import { savePatient, getPatient } from "../../services/patientService";

import Input from "../../common/input";
import Select from "../../common/select";
import DateInput from "../../common/dateInput";
import useFormData from "../../hooks/useFormData";
import UploadImage from "../../common/uploadImage";
import DisplayImage from "../../common/displayImage";
import BooleanSelect from "../../common/booleanSelect";
import DisplayDocument from "../../common/displayDocument";

import Joi from "joi-browser";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument, rgb } from "pdf-lib";

import { FaPrint } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";

import mutuelle1 from "../../assets/images/mutuelle1.jpg";
import mutuelle2 from "../../assets/images/mutuelle2.jpg";

function PatientForm({
  match,
  isRdvForm,
  selectedPatient,
  onPatientChange,
  dataIsValid,
}) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dents, setDents] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [numBordereau, setNumBordereau] = useState("");
  const [numDossier, setNumDossier] = useState("");
  const [signatureDate, setSignatureDate] = useState(new Date());
  const [signatureLieu, setSignatureLieu] = useState("Errachidia");
  const [nombrePieces, setNombrePieces] = useState("");

  const [accidentDate, setAccidentDate] = useState("");
  const [accidentCauses, setAccidentCauses] = useState("");

  const [telephone, setTelephone] = useState("");
  const [patientRdvs, setPatientRdvs] = useState([]);
  const [devis, setDevis] = useState([]);
  const [selectedDevis, setSelectedDevis] = useState([]);
  const [totalDevis, setTotalDevis] = useState([]);

  const history = useHistory();
  const params = useParams();
  const form = "patients";

  const schema = {
    isPatientAssure: Joi.boolean()
      .allow("")
      .allow(null)
      .label("Patient Assuré"),
    nomAssure: Joi.string().allow("").allow(null).label("Nom Assuré"),
    prenomAssure: Joi.string().allow("").allow(null).label("Prenom Assuré"),
    numImmatriculationAssure: Joi.string()
      .allow("")
      .allow(null)
      .label("N° Immatriculation"),
    numCINAssure: Joi.string().allow("").allow(null).label("N° CIN"),
    numAffiliationAssure: Joi.string()
      .allow("")
      .allow(null)
      .label("N° Affiliation"),
    isConjoint: Joi.boolean().allow("").allow(null).label("Conjoint"),
    cin: Joi.string().allow("").allow(null).label("CIN"),
    nom: Joi.string().required().label("Nom"),
    prenom: Joi.string().required().label("Prenom"),
    adresseAssure: Joi.string().allow("").allow(null).label("Adresse Assuré"),
    mutuelle: Joi.string().allow("").allow(null).label("Mutuelle"),
    adresse: Joi.string().allow("").allow(null).label("Ville"),
    observations: Joi.string().allow("").allow(null).label("Observations"),
    telephones: Joi.array().allow([]).label("Telephones"),
    profession: Joi.string().allow("").label("profession"),
    age: Joi.number().allow(null).allow("").label("Age"),
    isMasculin: Joi.boolean()
      .required() /* .allow(null) */
      .label("Genre"),
    dateNaissance: Joi.date()
      .iso()
      .allow("")
      .allow(null)
      .label("Date Naissance"),

    _id: Joi.string(),
    provinceId: Joi.string().allow("").allow(null).label("Province"),
    regionId: Joi.string().allow("").allow(null).label("Region"),
    // dateDerniereVisite: Joi.date().allow("").label("Date dernière visite"),
    historiqueMedecins: Joi.array().allow([]).label("Medecins"),
    images: Joi.label("Images").optional(),
    image: Joi.label("Image").optional(),
    documents: Joi.label("Documents").optional(),
    imagesDeletedIndex: Joi.label("imagesDeletedIndex").optional(),
    documentsDeletedIndex: Joi.label("documentsDeletedIndex").optional(),
  };
  const {
    data,
    errors,
    validate,
    saveFile,
    updateData,
    filePreviews,
    handleChange,
    isFileToSend,
    handleUpload,
    selectedDocs,
    isDocPicked,
    handleUploadDoc,
    handleSubmit,
    changeBoolean,
    cleanupFileUrls,
    handleDeleteImage,
    handleDeleteDoc,
  } = useFormData(
    {
      _id: undefined,
      isPatientAssure: "",
      nomAssure: "",
      prenomAssure: "",
      numImmatriculationAssure: "",
      numAffiliationAssure: "",
      numCINAssure: "",
      adresseAssure: "",
      isConjoint: "",
      cin: "",
      nom: "",
      prenom: "",
      mutuelle: "",
      adresse: "",
      profession: "",
      observations: "",
      telephones: [],
      isMasculin: "",
      dateNaissance: "",
      age: "",
      regionId: "",
      provinceId: "",
      images: [],
      documents: [],
    },
    schema,
    async (formData) => {
      try {
        delete formData.age;
        if (isFileToSend) {
          await saveFile(params.id, form);
        } else await savePatient(formData);

        if (match && match.params.id) {
          history.push("/patients");
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  );
  useEffect(() => {
    return () => cleanupFileUrls(); // Cleanup on unmount
  }, [cleanupFileUrls]);

  useEffect(() => {
    // let isActive = true;
    const getDatas = async () => {
      setLoadingData(true);
      const { data: regions } = await getRegions();
      const { data: provinces } = await getProvinces();
      const { data: dents } = await getDents();
      const { data: medecins } = await getMedecins();
      setMedecins(medecins);
      setRegions(regions);
      setProvinces(provinces);
      setDents(dents);
      setLoadingData(false);
    };
    getDatas();
    // return () => {
    //   isActive = false; // Set flag to false to ignore any pending updates when the component unmounts
    // };
  }, []);

  useEffect(() => {
    if (data.regionId) {
      const newFilteredProvinces = provinces.filter(
        (province) => province.regionId._id === data.regionId,
      );
      setFilteredProvinces(newFilteredProvinces);
    } else {
      setFilteredProvinces([]);
    }
  }, [data.regionId, provinces]);

  useEffect(() => {
    if (onPatientChange) {
      onPatientChange(data);
      dataIsValid(validate() ? false : true);
    }
  }, [data]);
  useEffect(() => {
    async function populatePatients() {
      try {
        setLoadingData(true);
        let patientId = undefined;
        // check the url if has a string "patients"
        if (history.location.pathname.includes("patients")) {
          patientId = params.id;
          if (patientId !== "new" && patientId !== undefined) {
            const { data: patient } = await getPatient(patientId);
            setTotalDevis(patient.deviIds.length);
            setDevis(patient.deviIds);
            updateData(mapToViewModel(patient));
          }
        }

        setLoadingData(false);
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          history.replace("/not-found");
        }
      }
    }

    populatePatients();
  }, [params.id, history]);

  useEffect(() => {
    if (
      selectedPatient &&
      selectedPatient._id &&
      selectedPatient._id !== data._id
    ) {
      updateData(mapToViewModel(selectedPatient));
    }
  }, [selectedPatient]);
  useEffect(() => {
    const getRdvs = async () => {
      const { data: rdvs } = await getPatientRdvs(data._id);
      setPatientRdvs(rdvs);
    };
    if (data._id) {
      getRdvs();
    }
  }, [data._id]);
  // change dateNaissance depending on age
  useEffect(() => {
    if (data.age) {
      const date = new Date();
      date.setFullYear(date.getFullYear() - data.age, 0, 1);
      updateData({ dateNaissance: date.toISOString() });
    }
  }, [data.age]);

  // update age depending on dateNaissance
  // useEffect(() => {
  //   if (data.dateNaissance) {
  //     const age =
  //       new Date().getFullYear() - new Date(data.dateNaissance).getFullYear();
  //     updateData({ age: undefined });
  //   }
  // }, [data.dateNaissance]);

  function mapToViewModel(patient) {
    return {
      _id: patient._id,
      isPatientAssure: patient.isPatientAssure,
      nomAssure: patient.nomAssure,
      prenomAssure: patient.prenomAssure,
      numImmatriculationAssure: patient.numImmatriculationAssure,
      numAffiliationAssure: patient.numAffiliationAssure,
      numCINAssure: patient.numCINAssure,
      adresseAssure: patient.adresseAssure,
      isConjoint: patient.isConjoint,

      cin: patient.cin,
      historiqueMedecins: patient.historiqueMedecins,
      nom: patient.nom,
      prenom: patient.prenom,
      mutuelle: patient.mutuelle,
      isMasculin: patient.isMasculin,
      profession: patient.profession,
      dateNaissance: patient.dateNaissance,
      observations: patient.observations,
      telephones: patient.telephones || [],
      adresse: patient.adresse,
      provinceId: patient.provinceId || "",
      regionId: patient.regionId || "",
      // calculate age from date of birth
      // age: patient.dateNaissance
      //   ? new Date().getFullYear() -
      //     new Date(patient.dateNaissance).getFullYear()
      //   : "",
      images: patient.images || [],
      documents: patient.documents || [],
      imagesDeletedIndex: [],
      documentsDeletedIndex: [],
    };
  }
  const handleSelectDevis = () => {
    let newSelectedDevis =
      selectedDevis.length === devis.length ? [] : [...devis];
    setSelectedDevis(newSelectedDevis);
  };

  const handleSelectDevi = (devi) => {
    let newSelectedDevis = [...selectedDevis];

    const index = newSelectedDevis.findIndex(
      (c) => c._id.toString() === devi._id.toString(),
    );
    if (index === -1) newSelectedDevis.push(devi);
    else newSelectedDevis.splice(index, 1);
    setSelectedDevis(newSelectedDevis);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleGeneratePdf = async () => {
    closeModal();
    // set data devis in selectedDevis to true
    let newDevis = [...devis];
    newDevis.forEach((devi) => {
      if (
        selectedDevis.findIndex((d) => d.deviId._id === devi.deviId._id) !== -1
      ) {
        devi.deviId.isCoveredMutuelle = true;
        devi.deviId.mutuelle = {
          numBordereau,
          numDossier,
          signatureDate,
          signatureLieu,
          nombrePieces,
        };
      }
    });
    setDevis(newDevis);
    // saveDeviIsCovered(newDevis);
    let newD = newDevis.map((devi) => {
      return {
        _id: devi.deviId._id,
        isCoveredMutuelle: true,
        mutuelle: {
          numBordereau,
          numDossier,
          signatureDate,
          signatureLieu,
          nombrePieces,
        },
      };
    });

    newD.forEach(async (devi) => {
      await saveDeviIsCovered(devi);
    });
    await generatePdf();
  };

  const displayPopup = () => {
    openModal();
  };
  async function generatePdf() {
    const imageBytes1 = await fetch(mutuelle1).then((res) => res.arrayBuffer());
    const imageBytes2 = await fetch(mutuelle2).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.create();
    const firstPage = pdfDoc.addPage();
    const secondPage = pdfDoc.addPage();
    const color = rgb(0.137, 0.243, 0.529);
    // Nom et prenom , cin assuré, N° immatriculation,  adresse, lienParenté (conjoint, enfant), montant des frais (Dhs),
    // nombre de pièces jointes,
    // nom prenom dateNaissance cin, sexe
    // N°INP, type de soins soins, prothèse, orthodentie et ODF, autres,
    // N° entente Préalable, En cas d'accident précisez: date, causes accident,
    // date et lieu et signature du patient et du médecin traitant
    // dents traitées, code actes, date acte, lettre clé+ cotation NGAP, montant facturé,
    let {
      nomAssure,
      prenomAssure,
      numCINAssure,
      adresseAssure,
      isPatientAssure,
      isConjoint,
      numImmatriculationAssure,
      numAffiliationAssure,
      nom,
      prenom,
      cin,
      adresse,
      isMasculin,
      dateNaissance,
    } = data;
    const frais = selectedDevis.reduce((acc, devi) => {
      return acc + devi.montant;
    }, 0);
    if (isPatientAssure) {
      nomAssure = nom;
      prenomAssure = prenom;
      numCINAssure = cin;
    }
    const jpgImage1 = await pdfDoc.embedJpg(imageBytes1);
    const jpgImage2 = await pdfDoc.embedJpg(imageBytes2);
    const fontBold = await pdfDoc.embedFont("Helvetica-Bold");
    const letterSpacing = 22; // Adjust this value for more or less space between letters
    const fontSize = 30;
    const font = await pdfDoc.embedFont("Helvetica");

    firstPage.setSize(jpgImage1.width, jpgImage1.height);
    secondPage.setSize(jpgImage2.width, jpgImage2.height);

    // Draw each character individually
    function drawForCase(
      page,
      text,
      x,
      y,
      fontSize,
      letterSpacing,
      font,
      color,
    ) {
      // si text est un nombre
      if (!text) return;
      if (!isNaN(text)) text = text.toString();
      text = text.toUpperCase();

      for (const char of text) {
        page.drawText(char, {
          x, // Adjust x-coordinate
          y, // Adjust y-coordinate
          size: fontSize,
          color,
          font,
        });

        // Update x-coordinate by character width + letter spacing
        x += font.widthOfTextAtSize(char, fontSize) + letterSpacing;
      }
    }

    const natureActes = {
      Soins: jpgImage1.height - 1800,
      Prothèse: jpgImage1.height - 1746,
      Orthodontie: jpgImage1.height - 1790,
    };
    let nature =
      selectedDevis[0] &&
      selectedDevis[0].deviId.acteEffectues[0].acteId.natureId.nom;
    let y = jpgImage1.height - 1840;
    for (let key in natureActes) {
      if (nature === key) {
        y = natureActes[key];
        break;
      }
    }

    // first page

    firstPage.drawImage(jpgImage1, {
      x: 0,
      y: 0,
      width: jpgImage1.width,
      height: jpgImage1.height,
    });
    secondPage.drawImage(jpgImage2, {
      x: 0,
      y: 0,
      width: jpgImage2.width,
      height: jpgImage2.height,
    });
    // N° Bordereau
    firstPage.drawText(numBordereau, {
      x: 2230,
      y: jpgImage1.height - 500,
      size: 34,
      font: fontBold,
      color,
    });
    // N° Dossier
    firstPage.drawText(numDossier, {
      x: 3070,
      y: jpgImage1.height - 500,
      size: 34,
      font: fontBold,
      color,
    });

    // nomAssure et prenomAssure
    firstPage.drawText(
      `${nomAssure.toUpperCase()} ${
        prenomAssure.charAt(0).toUpperCase() +
        prenomAssure.slice(1).toLowerCase()
      }`,
      {
        x: 2280, // Adjust x-coordinate
        y: jpgImage1.height - 624, // Adjust y-coordinate
        size: fontSize,
        font: fontBold,
        color,
      },
    );
    // numAffiliationAssure
    drawForCase(
      firstPage,
      numAffiliationAssure,
      2620,
      jpgImage1.height - 684,
      fontSize,
      letterSpacing,
      fontBold,
      color,
    );
    // numImmatriculationAssure
    drawForCase(
      firstPage,
      numImmatriculationAssure,
      2558,
      jpgImage1.height - 738,
      fontSize,
      23,
      fontBold,
      color,
    );
    // numCINAssure
    drawForCase(
      firstPage,
      numCINAssure,
      2574,
      jpgImage1.height - 794,
      fontSize,
      23,
      fontBold,
      color,
    );
    // isConjoint
    drawForCase(
      firstPage,
      "X",
      isConjoint ? 2640 : 2950,
      jpgImage1.height - 915,
      fontSize,
      letterSpacing,
      fontBold,
      color,
    );
    // adresse
    // i want to
    async function addTextWithFixedWidth(
      firstPage,
      text,
      maxWidth,
      x,
      startY,
      lineHeight,
      fontSize,
      font,
      color,
    ) {
      if (!text) return;
      const words = text.split(" ");
      let line = "";
      let yPosition = startY;

      for (let i = 0; i < words.length; i++) {
        // Check the width of the current line with the next word added
        const testLine = line + (line ? " " : "") + words[i];
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (textWidth > maxWidth) {
          // Draw the current line and move to the next line
          firstPage.drawText(line, {
            x: x,
            y: yPosition,
            size: fontSize,
            font: font,
            color: color,
          });
          yPosition -= lineHeight;
          line = words[i]; // Start new line with the current word
        } else {
          line = testLine; // Add the word to the current line
        }
      }

      // Draw the last line
      if (line) {
        firstPage.drawText(line, {
          x: x,
          y: yPosition,
          size: fontSize,
          font: font,
          color: color,
        });
      }
    }
    // adresse
    addTextWithFixedWidth(
      firstPage,
      isPatientAssure ? adresse : adresseAssure,
      1000,
      2200,
      jpgImage1.height - 968,
      54,
      fontSize,
      fontBold,
      color,
    );
    // montant des frais

    firstPage.drawText(frais.toString() + " Dh", {
      x: 2400,
      y: jpgImage1.height - 1085,
      size: 30,
      font: fontBold,
      color,
    });
    // nombre de pièces jointes

    firstPage.drawText(nombrePieces.toString(), {
      x: 2450,
      y: jpgImage1.height - 1140,
      size: 30,
      font: fontBold,
      color,
    });
    // nom et prenom
    firstPage.drawText(
      `${nom.toUpperCase()} ${
        prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
      }`,
      {
        x: 2280, // Adjust x-coordinate
        y: jpgImage1.height - 1308, // Adjust y-coordinate
        size: fontSize,
        font: fontBold,
        color,
      },
    );

    // if dateNaissance ajouter date cette format 01 01 2021, changer l'espacement entre les chiffres
    // a ce que entre les chiffres du jour soit meme que celui entre les chiffres du mois et de l'année mais entre les 3 groupes il y a plus d'espace
    // si jour ou mois < 10 ajouter un 0 devant
    if (dateNaissance) {
      const date = new Date(dateNaissance);
      const lettreSpace = 23;
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const month =
        date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const year = date.getFullYear();
      //  boucle for les 3 groupes and inside it another for to draw each number
      // draw day
      drawForCase(
        firstPage,
        day,
        2562,
        jpgImage1.height - 1370,
        fontSize,
        lettreSpace,
        fontBold,
        color,
      );
      // draw month
      drawForCase(
        firstPage,
        month,
        2655,
        jpgImage1.height - 1370,
        fontSize,
        lettreSpace,
        fontBold,
        color,
      );
      // draw year
      drawForCase(
        firstPage,
        year,
        2746,
        jpgImage1.height - 1370,
        fontSize,
        lettreSpace,
        fontBold,
        color,
      );
    }

    // date signature
    if (signatureDate) {
      const date = new Date(signatureDate);
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const month =
        date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const year = date.getFullYear();
      //  boucle for les 3 groupes and inside it another for to draw each number
      // draw day
      drawForCase(
        firstPage,
        day,
        2958,
        jpgImage1.height - 2190,
        27,
        26,
        fontBold,
        color,
      );
      // draw month
      drawForCase(
        firstPage,
        month,
        3046,
        jpgImage1.height - 2190,
        27,
        26,
        fontBold,
        color,
      );
      // draw year
      drawForCase(
        firstPage,
        year,
        3134,
        jpgImage1.height - 2190,
        27,
        26,
        fontBold,
        color,
      );
    }

    // lieu signature
    drawForCase(
      firstPage,
      signatureLieu,
      2958,
      jpgImage1.height - 2145,
      22,
      6,
      fontBold,
      color,
    );

    // draw cin
    drawForCase(
      firstPage,
      cin,
      2575,
      jpgImage1.height - 1415,
      fontSize,
      23,
      fontBold,
      color,
    );
    drawForCase(
      firstPage,
      "X",
      isMasculin ? 2585 : 2818,
      jpgImage1.height - 1480,
      fontSize,
      letterSpacing,
      fontBold,
      color,
    );
    drawForCase(
      firstPage,
      "X",
      2717,
      y,
      fontSize,
      letterSpacing,
      fontBold,
      color,
    );

    // dent traitées, code actes, date acte, lettre clé+ valeur clé, montant facturé
    let yActe = jpgImage1.height - 380;
    selectedDevis.forEach((devi, index) => {
      const { acteEffectues, /* medecinId, */ dateDevi } = devi.deviId;
      const date = `${new Date(dateDevi).getDate()}/${
        new Date(dateDevi).getMonth() + 1
      }/${new Date(dateDevi).getFullYear()}`;

      acteEffectues.forEach((acte, index) => {
        const { acteId, dentIds, prix } = acte;
        const { code: codeActe, nomActe } = acteId;

        // create an array of dents like this [dent1, dent2, dent3] and dent1 is the numeroFDI
        let selectedDents = [];

        dentIds.forEach((dentId, index) => {
          let dent = dents.find((d) => d._id === dentId);
          selectedDents.push(dent.numeroFDI);
        });

        // draw each dent
        let x = 1960;

        selectedDents.forEach((dent, index) => {
          secondPage.drawText(dent + ",", {
            x: x,
            y: yActe,
            size: 32,
            font: fontBold,
            color,
          });
          x += 50;
        });
        // secondPage.drawText(dent.numeroFDI, {
        //   x: 1990,
        //   y: yActe,
        //   size: 32,
        //   font: fontBold,
        //   color,
        // });
        secondPage.drawText(codeActe.toString(), {
          x: 2220,
          y: yActe,
          size: 32,
          font: fontBold,
          color,
        });
        secondPage.drawText(date, {
          x: 2390,
          y: yActe,
          size: 32,
          font: fontBold,
          color,
        });

        // prix
        secondPage.drawText(prix.toString() + " Dh", {
          x: 3020,
          y: yActe,
          size: 32,
          font: fontBold,
          color,
        });
        yActe = yActe - 70;
      });
    });
    // Save the PDF as a Blob
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    // Create a link to download the PDF
    const link = document.createElement("a");
    link.href = url;
    link.download = "filled-document.pdf";
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  }

  const handleIsCoveredMutuelle = async (item) => {
    // update data devi in selectedDevis
    let newDevis = [...devis];
    const index = newDevis.findIndex(
      (devi) => devi.deviId._id === item.deviId._id,
    );
    newDevis[index].deviId.isCoveredMutuelle =
      !newDevis[index].deviId.isCoveredMutuelle;
    let newDevi = {
      _id: item.deviId._id,
      isCoveredMutuelle: newDevis[index].deviId.isCoveredMutuelle,
    };
    await saveDeviIsCovered(newDevi);
    setDevis(newDevis);
  };
  return loadingData ? (
    <div className="m-auto my-4">
      <ClipLoader loading={loadingData} size={70} />
    </div>
  ) : (
    <>
      <div
        className={`mt-1 h-[fit-content] w-[100%] min-w-fit rounded-tr-md ${
          !isRdvForm && "border border-white bg-white"
        }`}
      >
        {(selectedPatient || (selectedPatient && selectedPatient._id)) && (
          <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
            Formulaire du patient
          </p>
        )}
        {!isRdvForm && (
          <div className="ml-2  flex justify-start">
            <button
              className="mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#4F6874] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white no-underline"
              onClick={() => {
                history.push("/patients");
              }}
            >
              <IoChevronBackCircleSharp className="mr-1 " />
              Retour à la Liste
            </button>
          </div>
        )}
        <form
          className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
          onSubmit={handleSubmit}
        >
          {!isRdvForm && (
            <div className="mt-3">
              <BooleanSelect
                name="isPatientAssure"
                value={data.isPatientAssure}
                label="Assurance"
                label1="Assuré"
                label2="Ayant Droit"
                changeBoolean={(value) => {
                  return changeBoolean("isPatientAssure", value);
                }}
                width={90}
                height={35}
                widthLabel={96}
              />
            </div>
          )}
          {!isRdvForm && data.isPatientAssure === false && (
            <div className="flex w-full flex-wrap bg-slate-300">
              <p className="m-2 mt-2 w-full text-lg font-bold text-[#474a52]">
                Formulaire ayant droit
              </p>
              <div className="mt-3">
                <Input
                  name="nomAssure"
                  label="Nom Assuré"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="text"
                  value={data.nomAssure || ""}
                  onChange={handleChange}
                  error={errors.nomAssure}
                />
              </div>
              <div className="mt-3">
                <Input
                  name="prenomAssure"
                  label="Prénom Assuré"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="text"
                  value={data.prenomAssure || ""}
                  onChange={handleChange}
                  error={errors.prenomAssure}
                />
              </div>

              <div className="mt-3">
                <Input
                  name="numCINAssure"
                  label="N° CIN Assuré"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="text"
                  value={data.numCINAssure || ""}
                  onChange={handleChange}
                  error={errors.numCINAssure}
                />
              </div>
              <div className="mt-3">
                <Input
                  name="adresseAssure"
                  label="Adresse Assuré"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="text"
                  value={data.adresseAssure || ""}
                  onChange={handleChange}
                  error={errors.adresseAssure}
                />
              </div>
              <div className="mt-3">
                <BooleanSelect
                  name="isConjoint"
                  value={data.isConjoint}
                  label="Lien Parenté"
                  label1="Conjoint"
                  label2="Enfant"
                  changeBoolean={(value) => {
                    return changeBoolean("isConjoint", value);
                  }}
                  width={90}
                  height={35}
                  widthLabel={96}
                />
              </div>
            </div>
          )}
          <div className="mt-3">
            <Input
              name="cin"
              label="CIN"
              width={180}
              height={35}
              widthLabel={96}
              type="text"
              value={data.cin || ""}
              onChange={handleChange}
              error={errors.cin}
            />
          </div>
          <div className="mt-3">
            <Input
              name="nom"
              label="Nom"
              width={180}
              height={35}
              widthLabel={96}
              type="text"
              value={data.nom || ""}
              onChange={handleChange}
              error={errors.nom}
            />
          </div>
          <div className="mt-3">
            <Input
              name="prenom"
              label="Prénom"
              width={180}
              height={35}
              widthLabel={96}
              type="text"
              value={data.prenom || ""}
              onChange={handleChange}
              error={errors.prenom}
            />
          </div>
          <div className="mt-3">
            <BooleanSelect
              name="isMasculin"
              value={data.isMasculin}
              label="Genre"
              label1="Masculin"
              label2="Féminin"
              changeBoolean={(value) => {
                return changeBoolean("isMasculin", value);
              }}
              width={90}
              height={35}
              widthLabel={96}
            />
          </div>
          {!isRdvForm && (
            <div className="mt-3">
              <Input
                name="age"
                label="Age"
                width={180}
                height={35}
                widthLabel={96}
                min={1}
                type="number"
                value={data.age || ""}
                onChange={handleChange}
                error={errors.age}
              />
            </div>
          )}
          {!isRdvForm && (
            <div className="mt-3">
              <DateInput
                name="dateNaissance"
                label="Date naissance"
                value={data.dateNaissance}
                onChange={handleChange}
                error={errors.dateNaissance}
                width={180}
              />
            </div>
          )}

          {/* <div className="mt-3">
          <Input
            name="telephone"
            label="Téléphone"
            width={180}
            height={35}
            widthLabel={96}
            type="text"
            value={data.telephone || ""}
            onChange={handleChange}
            error={errors.telephone}
          />
        </div> */}
          <div className="mt-3">
            <Input
              name="mutuelle"
              label="Mutuelle"
              width={180}
              height={35}
              widthLabel={96}
              type="text"
              value={data.mutuelle || ""}
              onChange={handleChange}
              error={errors.mutuelle}
            />
          </div>

          {!isRdvForm && (
            <>
              <div className="mt-3">
                <Input
                  name="numImmatriculationAssure"
                  label="N° Immatriculat°"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="text"
                  value={data.numImmatriculationAssure || ""}
                  onChange={handleChange}
                  error={errors.numImmatriculationAssure}
                />
              </div>
              <div className="mt-3">
                <Input
                  name="numAffiliationAssure"
                  label="N° Affiliation"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="text"
                  value={data.numAffiliationAssure || ""}
                  onChange={handleChange}
                  error={errors.numAffiliationAssure}
                />
              </div>
              {data.isPatientAssure && (
                <div className="mt-3">
                  <Input
                    name="adresse"
                    label="Adresse"
                    width={180}
                    height={35}
                    widthLabel={96}
                    type="text"
                    value={data.adresse || ""}
                    onChange={handleChange}
                    error={errors.adresse}
                  />
                </div>
              )}
              <div className="mt-3">
                <Input
                  name="profession"
                  label="Profession"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="text"
                  value={data.profession || ""}
                  onChange={handleChange}
                  error={errors.profession}
                />
              </div>
            </>
          )}
          <div className="mt-3">
            <Input
              name="observations"
              label="Observations"
              width={180}
              height={35}
              widthLabel={96}
              type="text"
              value={data.observations || ""}
              onChange={handleChange}
              error={errors.observations}
            />
          </div>
          <div className="mt-3">
            <Select
              name="regionId"
              label="Region"
              options={regions}
              widthLabel={96}
              width={180}
              height={35}
              value={data.regionId}
              onChange={handleChange}
              error={errors.regionId}
            />
          </div>
          <div className="mt-3">
            <Select
              name="provinceId"
              label="Province"
              options={filteredProvinces}
              widthLabel={96}
              width={180}
              height={35}
              value={data.provinceId}
              onChange={handleChange}
              error={errors.provinceId}
            />
          </div>
          {/* input and button to add telephone */}
          <div className="my-2 flex w-full flex-row rounded-sm bg-slate-200 ">
            <div className="my-3 flex flex-row">
              <Input
                name="telephone"
                label="Téléphone"
                width={155}
                height={35}
                widthLabel={96}
                type="text"
                value={telephone || ""}
                onChange={(e) => setTelephone(e.currentTarget.value)}
                error={errors.telephone}
              />
              <button
                className="ml-2 h-fit rounded-md bg-blue-500 p-1 font-bold text-white"
                onClick={(e) => {
                  e.preventDefault();
                  if (telephone) {
                    const newTelephones = [...data.telephones];
                    newTelephones.push(telephone);
                    updateData({ telephones: newTelephones });
                    setTelephone("");
                  }
                }}
              >
                +
              </button>
            </div>
            {/* liste of telephones like inputs, alawys one empty to let the user add  */}
            <div className="flex flex-col">
              {data.telephones &&
                data.telephones.map((telephone, index) => (
                  <div key={index} className="mt-3 flex flex-row">
                    <Input
                      name="telephones"
                      width={145}
                      height={35}
                      widthLabel={96}
                      label={`Téléphone ${index + 1}`}
                      type="text"
                      value={telephone || ""}
                      onChange={(e) => {
                        const newTelephones = [...data.telephones];
                        newTelephones[index] = e.currentTarget.value;
                        updateData({ telephones: newTelephones });
                      }}
                      error={errors.telephones}
                    />
                    {/* button to delete the item */}
                    <button
                      className="m-auto ml-1  rounded-md bg-red-500 p-2 font-bold text-white"
                      onClick={() => {
                        const newTelephones = [...data.telephones];
                        newTelephones.splice(index, 1);
                        updateData({ telephones: newTelephones });
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
            </div>
          </div>
          {!isRdvForm && (
            <>
              <div className="mt-3 w-full">
                <UploadImage
                  name="image"
                  label="Photo"
                  image={filePreviews && filePreviews.image}
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="file"
                  onChange={handleUpload}
                />
              </div>
              <div className="mt-3 w-full">
                <DisplayImage
                  name="images"
                  widthLabel={96}
                  images={data.images}
                  label="Images"
                  width={200}
                  height={35}
                  deleteImage={handleDeleteImage}
                />
              </div>
              <div className="mt-3 w-full">
                <div className="flex flex-row">
                  <label
                    className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]"
                    style={{ width: 96 }}
                  >
                    Document
                  </label>
                  <input
                    type="file"
                    name="documents"
                    /* style={{
                    width: 86,
                    height: 35,
                    fontSize: "0.75rem",
                  }} */
                    multiple
                    onChange={handleUploadDoc}
                  />
                </div>
                {/* {isDocPicked && (
                <div>
                  <p>Filename: {selectedDoc.name}</p>
                  {selectedDoc.size > 1000000
                    ? `Size: ${Math.round(selectedDoc.size / 1000000)} MB`
                    : `Size: ${
                        Math.round ? selectedDoc.size / 1000 : selectedDoc.size
                      } KB`}
                </div>
              )} */}
              </div>
              {/* <div className="mt-3 w-full">
              <div className={` flex  `}>
                <label
                  className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]"
                  style={{ width: 96 }}
                >
                  Documents
                </label>
                <div>
                  {data.documents.map((doc, index) => {
                    let i = data.documentsDeletedIndex.findIndex(
                      (i) => i === index,
                    );

                    // if (i !== -1) return null;
                    const docName = doc.split("/")[1].split("-")[0];
                    const docType = doc.split("/")[1].split("-")[1];
                    const docDate = doc.split("/")[1].split("-")[2];

                    if (i !== -1) {
                      return (
                        <div key={index} className="mt-3 flex  flex-row">
                          <div className="flex">
                            <label
                              htmlFor=""
                              className="m-auto ml-1 text-[11px] text-slate-500 line-through"
                            >
                              {`${docName}.${docType}`}
                            </label>
                            <label
                              htmlFor=""
                              className="m-auto ml-1 text-[11px] text-slate-500 line-through"
                            >
                              {`${new Date(parseInt(docDate)).getDate()}-${
                                new Date(parseInt(docDate)).getMonth() + 1
                              }-${new Date(parseInt(docDate)).getFullYear()}`}
                            </label>
                            <button
                              className="m-auto   ml-1 h-7 w-6 rounded-md bg-green-500 font-bold text-white"
                              onClick={(e) => {
                                handleDeleteDoc(doc, e, index);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="mt-3 flex  flex-row">
                        <div className="flex">
                          <a
                            href={
                              process.env.REACT_APP_API_IMAGE_URL + "/" + doc
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex"
                          >
                            <img
                              src={docType === "pdf" ? pdfIcon : wordIcon}
                              alt="file"
                              className="h-10 w-10"
                            />
                            <label
                              htmlFor=""
                              className="m-auto ml-1 cursor-pointer"
                            >
                              {`${docName}.${docType}`}
                            </label>
                          </a>

                          <label
                            htmlFor=""
                            className="m-auto ml-1 text-[11px] text-slate-500"
                          >
                            {`${new Date(parseInt(docDate)).getDate()}-${
                              new Date(parseInt(docDate)).getMonth() + 1
                            }-${new Date(parseInt(docDate)).getFullYear()}`}
                          </label>
                          <button
                            className="m-auto   ml-1 h-7 w-6 rounded-md bg-red-500 font-bold text-white"
                            onClick={(e) => {
                              handleDeleteDoc(doc, e, index);
                            }}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div> */}
              <DisplayDocument
                name="documents"
                widthLabel={96}
                documents={data.documents}
                label="Documents"
                width={200}
                height={35}
                deleteDocument={handleDeleteDoc}
              />
              <div className="mr-6 mt-3 flex w-full justify-end">
                <button
                  type="submit"
                  className={
                    !validate()
                      ? "cursor-pointer rounded-5px border-0   bg-custom-blue pl-3 pr-3 text-xs font-medium leading-7 text-white shadow-custom "
                      : "pointer-events-none cursor-not-allowed rounded-5px   border border-blue-40 bg-grey-ea pl-3 pr-3 text-xs leading-7 text-grey-c0"
                  }
                >
                  Sauvegrader
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      {data._id && (
        <div
          className={`mt-3 h-[fit-content] w-[100%] min-w-fit rounded-md ${
            !isRdvForm ? "border border-white bg-white" : "m-2 bg-white p-2 "
          }`}
        >
          <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
            Liste des RDVS
          </p>
          {patientRdvs.length !== 0 ? (
            <table className="  m-auto mb-2 ml-2 mr-2 h-fit">
              <thead className="h-12  text-[#4f5361]">
                <tr className="h-8 w-[100%] bg-[#83BCCD] text-center">
                  <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                    Date
                  </th>
                  <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                    Heure début
                  </th>
                  <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                    Acte
                  </th>
                  <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                    Etat
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientRdvs.map((rdv) => (
                  <tr key={rdv._id} className={`h-12 border-2 text-center`}>
                    <td className="px-1 text-xs font-medium text-[#2f2f2f]">{`${new Date(
                      rdv.datePrevu,
                    ).getDate()}/${new Date(
                      rdv.datePrevu,
                    ).getMonth()}/${new Date(
                      rdv.datePrevu,
                    ).getFullYear()}`}</td>
                    <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                      {rdv.heureDebut.heure}:{rdv.heureDebut.minute} {" -> "}
                      {rdv.heureFin.heure}:{rdv.heureFin.minute}
                    </td>
                    <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                      {rdv.acteId && rdv.acteId.nom}
                    </td>
                    <td
                      className={` text-[#2f2f2f]" px-1 text-xs font-medium ${
                        rdv.isHonnore
                          ? "bg-[#1ca83b]"
                          : rdv.isAnnule
                            ? "bg-[#ff8c8c]"
                            : rdv.isReporte
                              ? "bg-[#e49012]"
                              : new Date(rdv.date) < new Date()
                                ? "bg-[#ad1e31]"
                                : ""
                      } `}
                    >
                      {rdv.isHonnore
                        ? "Honnoré"
                        : rdv.isReporte
                          ? "Reporté"
                          : rdv.isAnnule
                            ? "Annulé"
                            : new Date(rdv.date) < new Date()
                              ? "Non honoré"
                              : "En attente"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="m-auto my-4 ml-2">
              <p className=" font-bold text-[#474a52]">Aucun RDV</p>
            </div>
          )}
        </div>
      )}
      {data._id && (
        <div
          className={`mt-3 h-[fit-content] w-[100%] min-w-fit rounded-md ${
            !isRdvForm ? "border border-white bg-white" : "m-2 bg-white p-2 "
          }`}
        >
          <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
            Liste des devis
          </p>

          {devis.length !== 0 ? (
            <>
              <div className=" m-2 flex h-7 items-center gap-2 rounded-md  border-slate-300 bg-[#D6E1E3] shadow-md ">
                <FaFilePdf
                  className={`$ h-6 w-7 cursor-pointer rounded-md p-1 shadow-md ${
                    selectedDevis.length === 0
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  title="Imprimer mutuelle"
                  color="#474a52"
                  onClick={displayPopup}
                />
              </div>
              <table className="  m-auto mb-2 ml-2 mr-2 h-fit">
                <thead className="h-12  text-[#4f5361]">
                  <tr className="h-8 w-[100%] bg-[#83BCCD] text-center">
                    <th
                      key={uuidv4()}
                      className="w-8"
                      //   onClick={() => {
                      //     return onSort(headers[index].name);
                      //   }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedDevis &&
                          totalDevis &&
                          totalDevis === selectedDevis.length
                        }
                        onChange={handleSelectDevis}
                      />
                    </th>

                    <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                      Date
                    </th>
                    <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                      Acte Dentaire
                    </th>
                    <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                      Prix
                    </th>
                    <th className="px-3 text-xs font-semibold text-[#2f2f2f]">
                      Mutuelle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {devis.map((devi) => (
                    <tr key={devi._id} className={`h-12 border-2 text-center`}>
                      <td className=" h-12  border-y-2 border-y-gray-300 bg-[#D6E1E3]  text-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedDevis.findIndex(
                              (c) => c._id === devi._id,
                            ) !== -1
                          }
                          onChange={() => handleSelectDevi(devi)}
                        />
                      </td>

                      <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                        {devi.deviId && devi.deviId.dateDevi
                          ? `${new Date(devi.deviId.dateDevi).getDate()}/${new Date(
                              devi.deviId.dateDevi,
                            ).getMonth()}/${new Date(
                              devi.deviId.dateDevi,
                            ).getFullYear()}`
                          : ""}
                      </td>
                      <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                        {/* deviId.acteEffectues[{acteId.nom}] */}
                        {devi.deviId &&
                          devi.deviId.acteEffectues.map((acte) => (
                            <div key={acte.acteId._id}>- {acte.acteId.nom}</div>
                          ))}
                      </td>
                      <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                        <div className="w-max">{`${devi.montant} Dh`}</div>
                      </td>
                      <td className="px-1 text-xs font-medium text-[#2f2f2f]">
                        {/* {devi.deviId &&
                        devi.deviId.mutuelle &&
                        devi.deviId.mutuelle.numBordereau} */}
                        {` ${devi.deviId && devi.deviId.mutuelle && devi.deviId.mutuelle.numBordereau ? "Bodereau N° :" + devi.deviId.mutuelle.numBordereau : ""}  ${devi.deviId && devi.deviId.mutuelle && devi.deviId.mutuelle.signatureDate ? `du ${new Date(devi.deviId.mutuelle.signatureDate).getDate()}/${new Date(devi.deviId.mutuelle.signatureDate).getMonth()}/${new Date(devi.deviId.mutuelle.signatureDate).getFullYear()}` : ""}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="m-auto my-4 ml-2">
              <p className=" font-bold text-[#474a52]">Aucun Devi</p>
            </div>
          )}
          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Informations supplémentaires pour le PDF"
            className="z-1001 m-auto max-w-[90%] rounded-md bg-white p-5 shadow-sm"
            overlayClassName="fixed top-0 left-0 right-0 h-full bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-1000"
          >
            <p className="m-2 mt-2 w-full text-xl font-bold text-[#474a52]">
              Informations pour le PDF
            </p>
            <form>
              {/* numBordereau */}
              <div className="mt-3">
                <Input
                  label="N° bordereau"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="number"
                  value={numBordereau || ""}
                  onChange={(e) => setNumBordereau(e.target.value)}
                />
              </div>

              {/* numDossier */}
              <div className="mt-3">
                <Input
                  label="N° dossier"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="number"
                  value={numDossier || ""}
                  onChange={(e) => setNumDossier(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <DateInput
                  label="Date de signature"
                  value={signatureDate}
                  width={180}
                  height={35}
                  widthLabel={96}
                  onChange={(e) => setSignatureDate(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <Input
                  label="Lieu de signature"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="text"
                  value={signatureLieu || ""}
                  onChange={(e) => setSignatureLieu(e.target.value)}
                />
              </div>
              {/* nombre de pièce */}
              <div className="mt-3">
                <Input
                  label="Nombre de pièce"
                  width={180}
                  height={35}
                  widthLabel={96}
                  type="number"
                  value={nombrePieces || ""}
                  onChange={(e) => setNombrePieces(e.target.value)}
                />
              </div>
              <div className="mt-2 flex flex-row justify-between">
                <button
                  type="button"
                  className="cursor-pointer rounded-5px border-0   bg-custom-blue pl-3 pr-3 text-xs font-medium leading-7 text-white shadow-custom "
                  onClick={handleGeneratePdf}
                >
                  Générer le PDF
                </button>
                <button
                  className="cursor-pointer rounded-5px border-0   bg-red-400 pl-3 pr-3 text-xs font-medium leading-7 text-white shadow-custom "
                  onClick={closeModal}
                >
                  Annuler
                </button>
              </div>
            </form>
          </ReactModal>
        </div>
      )}
    </>
  );
}
ReactModal.setAppElement("#root"); // #root est l'id du div dans index.html où l'app React est montée

export default PatientForm;
