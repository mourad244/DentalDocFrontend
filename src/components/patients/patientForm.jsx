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
import DisplayImage from "../../common/displayImage";
import BooleanSelect from "../../common/booleanSelect";

import Joi from "joi-browser";
import ClipLoader from "react-spinners/ClipLoader";
import { IoChevronBackCircleSharp } from "react-icons/io5";

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
  const [telephone, setTelephone] = useState("");
  const history = useHistory();
  const params = useParams();
  const form = "patients";

  const schema = {
    cin: Joi.string().allow("").allow(null).label("CIN"),
    nom: Joi.string().required().label("Nom"),
    prenom: Joi.string().required().label("Prenom"),
    telephone: Joi.string()
      .required() /* .allow("") */
      .label("telephone"),
    mutuelle: Joi.string().allow("").allow(null).label("Mutuelle"),
    numMutuelle: Joi.string().allow("").allow(null).label("N° Mutuelle"),
    ville: Joi.string().allow("").allow(null).label("Ville"),
    observations: Joi.string().allow("").allow(null).label("Observations"),
    telephones: Joi.array().allow([]).label("Telephones"),
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
    errors,
    validate,
    saveFile,
    updateData,
    filePreviews,
    handleChange,
    isFileToSend,
    handleUpload,
    handleSubmit,
    changeBoolean,
    cleanupFileUrls,
    handleDeleteImage,
  } = useFormData(
    {
      _id: undefined,
      cin: "",
      nom: "",
      prenom: "",
      telephone: "",
      mutuelle: "",
      numMutuelle: "",
      ville: "",
      profession: "",
      observations: "",
      telephones: [],
      isMasculin: "",
      dateNaissance: "",
      regionId: "",
      provinceId: "",
      images: [],
    },
    schema,
    async (formData) => {
      try {
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
      setRegions(regions);
      setProvinces(provinces);
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

  function mapToViewModel(patient) {
    return {
      _id: patient._id,
      cin: patient.cin,
      historiqueMedecins: patient.historiqueMedecins,
      nom: patient.nom,
      prenom: patient.prenom,
      mutuelle: patient.mutuelle,
      numMutuelle: patient.numMutuelle,
      isMasculin: patient.isMasculin,
      profession: patient.profession,
      dateNaissance: patient.dateNaissance,
      observations: patient.observations,
      telephones: patient.telephones,
      telephone: patient.telephone,
      ville: patient.ville,
      provinceId: patient.provinceId || "",
      regionId: patient.regionId || "",
      images: patient.images || [],
      imagesDeletedIndex: [],
    };
  }

  return loadingData ? (
    <div className="m-auto my-4">
      <ClipLoader loading={loadingData} size={70} />
    </div>
  ) : (
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
        {!isRdvForm && (
          <div className="mt-3">
            <DateInput
              name="dateNaissance"
              label="Date naissance"
              value={data.dateNaissance}
              onChange={handleChange}
              error={errors.dateNaissance}
            />
          </div>
        )}

        {/* <div className="mt-3">
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
        </div> */}
        <div className="mt-3">
          <Input
            name="mutuelle"
            label="Mutuelle"
            width={170}
            height={35}
            widthLabel={96}
            type="text"
            value={data.mutuelle || ""}
            onChange={handleChange}
            error={errors.mutuelle}
          />
        </div>
        <div className="mt-3">
          <Input
            name="numMutuelle"
            label="N° Mutuelle"
            width={170}
            height={35}
            widthLabel={96}
            type="text"
            value={data.numMutuelle || ""}
            onChange={handleChange}
            error={errors.numMutuelle}
          />
        </div>
        {!isRdvForm && (
          <>
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
          </>
        )}
        <div className="mt-3">
          <Input
            name="observations"
            label="Observations"
            width={170}
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
        {/* input and button to add telephone */}
        <div className="my-2 flex w-full flex-row rounded-sm bg-slate-200 ">
          <div className="mt-3 flex flex-row">
            <Input
              name="telephone"
              label="Téléphone"
              width={145}
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
            {data.telephones.map((telephone, index) => (
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
                image={filePreviews.image}
                width={170}
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
  );
}

export default PatientForm;
