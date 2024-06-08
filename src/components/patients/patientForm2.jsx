import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { getRegions } from "../../services/regionService";
import { savePatient, getPatient } from "../../services/patientService";
import { getProvinces } from "../../services/provinceService";

import Input from "../../common/input";
import Select from "../../common/select";
import DateInput from "../../common/dateInput";
import useFormData from "../../hooks/useFormData";
import UploadImage from "../../common/uploadImage";
import BooleanSelect from "../../common/booleanSelect";

import Joi from "joi-browser";

function PatientForm2({ match }) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);

  const history = useHistory();
  const params = useParams();

  const onSubmit = async (formData) => {
    try {
      await savePatient(formData); // Assuming savePatient returns a promise
      // Handle navigation after saving
      if (match && match.params.id) {
        history.push("/patients");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally handle errors, such as updating a state to show error messages
    }
  };
  const schema = {
    cin: Joi.string().allow("").allow(null).label("CIN"),
    nom: Joi.string().required().label("Nom"),
    prenom: Joi.string().required().label("Prenom"),
    telephone: Joi.string()
      .required() /* .allow("") */
      .label("telephone"),
    ville: Joi.string().allow("").allow(null).label("Ville"),
    profession: Joi.string().allow("").label("profession"),
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
    imagesDeletedIndex: Joi.label("imagesDeletedIndex").optional(),
  };
  const {
    data,
    updateData,
    errors,
    filePreviews,
    handleChange,
    loading,
    fileData,
    changeBoolean,
    cleanupFileUrls,
    handleSubmit,
  } = useFormData(
    {
      cin: "",
      nom: "",
      prenom: "",
      telephone: "",
      ville: "",
      profession: "",
      isMasculin: "",
      dateNaissance: "",
      regionId: "",
      provinceId: "",
      // image: null,
      images: [],
    },
    schema,
    onSubmit,
  );
  useEffect(() => {
    return () => cleanupFileUrls(); // Cleanup on unmount
  }, [cleanupFileUrls]);
  console.log("filePreviews", filePreviews);
  console.log("fileData", fileData);
  useEffect(() => {
    const getDatas = async () => {
      const { data: regions } = await getRegions();
      const { data: provinces } = await getProvinces();
      setRegions(regions);
      setProvinces(provinces);
    };
    getDatas();
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

  // useEffect(() => {
  //   // Cleanup URLs to avoid memory leaks
  //   return () => image.forEach((url) => URL.revokeObjectURL(url));
  // }, [image]);

  useEffect(() => {
    async function populatePatients() {
      try {
        const patientId = params.id;
        if (patientId === "new" || !patientId) return;

        const { data: patient } = await getPatient(patientId);
        updateData(mapToViewModel(patient));
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          history.replace("/not-found");
        }
      }
    }

    populatePatients();
  }, [params.id, history]);

  function mapToViewModel(patient) {
    return {
      _id: patient._id,
      cin: patient.cin,
      historiqueMedecins: patient.historiqueMedecins,
      nom: patient.nom,
      prenom: patient.prenom,
      isMasculin: patient.isMasculin,
      profession: patient.profession,
      dateNaissance: patient.dateNaissance,
      telephone: patient.telephone,
      ville: patient.ville,
      provinceId: patient.provinceId || "",
      regionId: patient.regionId || "",
      images: patient.images || [],
      imagesDeletedIndex: [],
    };
  }
  return (
    <div
      className={`mt-1 h-[fit-content] w-[100%] min-w-fit rounded-tr-md border border-white bg-white`}
    >
      <form
        className="mb-6 ml-2 mr-2.5 mt-2 flex w-[100%] flex-wrap justify-start"
        onSubmit={handleSubmit}
      >
        <div className="mt-3">
          <Input
            name="cin"
            label="CIN"
            width={170}
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
            width={170}
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
            width={170}
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
            width={85}
            height={35}
            widthLabel={96}
          />
        </div>
        <div className="mt-3">
          <DateInput
            name="dateNaissance"
            label="Date naissance"
            value={data.dateNaissance}
            onChange={handleChange}
            error={errors.dateNaissance}
          />
        </div>
        <div className="mt-3">
          <Input
            name="telephone"
            label="Téléphone"
            width={170}
            height={35}
            widthLabel={96}
            type="text"
            value={data.telephone || ""}
            onChange={handleChange}
            error={errors.telephone}
          />
        </div>
        <div className="mt-3">
          <Input
            name="ville"
            label="Ville"
            width={170}
            height={35}
            widthLabel={96}
            type="text"
            value={data.ville || ""}
            onChange={handleChange}
            error={errors.ville}
          />
        </div>
        <div className="mt-3">
          <Input
            name="profession"
            label="Profession"
            width={170}
            height={35}
            widthLabel={96}
            type="text"
            value={data.profession || ""}
            onChange={handleChange}
            error={errors.profession}
          />
        </div>
        <div className="mt-3">
          <Select
            name="regionId"
            label="Region"
            options={regions}
            widthLabel={96}
            width={170}
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
            width={170}
            height={35}
            value={data.provinceId}
            onChange={handleChange}
            error={errors.provinceId}
          />
        </div>
        <div className="mt-3 w-full">
          <UploadImage
            name="image"
            label="Photo"
            image={filePreviews.image}
            width={170}
            height={35}
            widthLabel={96}
            type="file"
            onChange={handleChange}
          />
        </div>
        <div className="mr-6 mt-3 flex w-full justify-end">
          <button type="submit" disabled={loading}>
            Sauvegrader
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientForm2;
