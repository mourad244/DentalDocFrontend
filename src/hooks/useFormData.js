import { useState, useCallback } from "react";
import Joi from "joi-browser";
import axios from "axios";
import { jsonToFormData } from "../utils/jsonToFormData";

function useFormData(initialValues, schema, onSubmit) {
  const [data, setData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [fileData, setFileData] = useState({}); // To store actual file objects for submission
  const [filePreviews, setFilePreviews] = useState({}); // To store URLs for previewing files
  const [loading, setLoading] = useState(false);
  const [isFileToSend, setIsFileToSend] = useState(false);
  const updateData = (newData) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };
  // Validate entire form
  const validate = useCallback(() => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);
    if (!error) return null;

    const validationErrors = {};
    for (let item of error.details) {
      validationErrors[item.path[0]] = item.message;
    }
    return validationErrors;
  }, [data, schema]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await onSubmit(data); // Make sure onSubmit is prepared to handle FormData
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setLoading(false);
  };

  const validateProperty = (name, value) => {
    const obj = { [name]: value };
    const fieldSchema = Joi.object({
      [name]: schema[name],
    });
    const result = fieldSchema.validate(obj);
    return result.error ? result.error.details[0].message : null;
  };

  const handleDeleteImage = (name, e, index) => {
    e.preventDefault();
    const imagesDeletedIndex = [...data.imagesDeletedIndex];
    imagesDeletedIndex.push(index);
    setData({ ...data, imagesDeletedIndex });
  };
  const handleUpload = (event) => {
    const { name, files } = event.target;
    const fileList = Array.from(files);
    const fileUrls = fileList.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => ({ ...prev, [name]: fileUrls }));
    setFileData((prev) => ({ ...prev, [name]: files }));
    setIsFileToSend(true);
  };
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const actualValue = type === "checkbox" ? checked : value;
    const errorMessage = validateProperty(name, actualValue);

    const newErrors = { ...errors, [name]: errorMessage };
    if (!errorMessage) delete newErrors[name];

    const newData = {
      ...data,
      [name]: actualValue,
    };
    setData(newData);
    setErrors(newErrors);
  };

  const changeBoolean = (name, value) => {
    const newData = { ...data, [name]: value };
    setData(newData);
    const errorMessage = validateProperty(name, value);
    if (errorMessage) {
      setErrors({ ...errors, [name]: errorMessage });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Cleanup function for file URLs to avoid memory leaks
  const cleanupFileUrls = useCallback(() => {
    Object.values(filePreviews).forEach((urls) =>
      urls.forEach(URL.revokeObjectURL),
    );
  }, [filePreviews]);

  const saveFile = async (id, form) => {
    let selectedId = undefined;
    if (id !== undefined && id !== "new") {
      selectedId = id;
    }
    let fd = new FormData();
    let newData = { ...data };
    delete newData._id;
    delete newData.images;

    fd = jsonToFormData(newData);

    filePreviews.image.forEach((file, index) => {
      fd.append("image", fileData.image[index]);
    });

    if (selectedId) {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/${form}/${selectedId}`,
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        method: "put",
      });
    } else
      await axios({
        url: `${process.env.REACT_APP_API_URL}/${form}`,
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        method: "post",
      });
  };
  return {
    data,
    errors,
    validate,
    fileData,
    saveFile,
    isFileToSend,
    updateData,
    loading,
    filePreviews,
    cleanupFileUrls,
    handleDeleteImage,
    handleChange,
    changeBoolean,
    handleSubmit,
    handleUpload,
  };
}

export default useFormData;
