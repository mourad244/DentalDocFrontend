import { useState, useCallback } from "react";
import Joi from "joi-browser";
import axios from "axios";
import { jsonToFormData } from "../utils/jsonToFormData";

function useFormData(initialValues, schema, onSubmit) {
  const [data, setData] = useState(initialValues);

  const [selectedDocs, setSelectedDocs] = useState(null);
  const [isDocPicked, setIsDocPicked] = useState(false);

  const [errors, setErrors] = useState({});
  const [fileData, setFileData] = useState({}); // To store actual file objects for submission
  const [filePreviews, setFilePreviews] = useState(null); // To store URLs for previewing files
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

  const handleDeleteDoc = (name, e, index) => {
    e.preventDefault();
    const documentsDeletedIndex = [...data.documentsDeletedIndex];
    documentsDeletedIndex.push(index);
    setData({ ...data, documentsDeletedIndex });
  };
  const handleUploadDoc = (event) => {
    const files = event.target.files;
    const maxSize = 1024 * 1024 * 5; // 5MB
    // allowed typed are word , pdf and excel
    const allowedTypes = ["pdf", "word", "excel"];
    let isFileValid = true;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        alert("File size is too large. Please upload a file less than 5MB.");
        isFileValid = false;
        return;
      }
      const fileType = files[i].type;
      const isTypeAllowed = allowedTypes.some((type) =>
        fileType.includes(type),
      );
      if (!isTypeAllowed) {
        alert(
          "File type is not allowed. Please upload a file with the following types: pdf, word, excel.",
        );
        isFileValid = false;
        return;
      }
    }
    if (!isFileValid) return;
    setSelectedDocs(files);
    setIsFileToSend(true);

    setFileData((prev) => ({ ...prev, document: files }));
    setIsDocPicked(true);
  };
  const handleUpload = (event) => {
    const { name, files } = event.target;
    const maxSize = 5 * 1024 * 1024; // Set max size (5MB in this case)
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]; // Allowed MIME types

    const fileList = Array.from(files);
    const validFiles = []; // To store valid files

    const fileUrls = [];

    fileList.forEach((file) => {
      // Check if file type is allowed
      if (!allowedTypes.includes(file.type)) {
        alert(
          `${file.name} is not a valid type. Please upload PNG, JPEG, or JPG.`,
        );
        return;
      }

      // Check if file size is within the allowed limit
      if (file.size > maxSize) {
        alert(`${file.name} exceeds the maximum size of 5MB.`);
        return;
      }

      // If valid, add the file to the valid files array and create a preview URL
      validFiles.push(file);
      fileUrls.push(URL.createObjectURL(file));
    });

    // If there are valid files, update state
    if (validFiles.length > 0) {
      setFilePreviews((prev) => ({ ...prev, [name]: fileUrls }));
      setFileData((prev) => ({ ...prev, [name]: validFiles }));
      setIsFileToSend(true);
    }
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
    if (!filePreviews) return;
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
    delete newData.documents;
    fd = jsonToFormData(newData);

    // logic to add documents to the form data

    filePreviews &&
      filePreviews.image.forEach((file, index) => {
        fd.append("image", fileData.image[index]);
      });

    if (fileData.document) {
      for (let i = 0; i < fileData.document.length; i++) {
        fd.append("document", fileData.document[i]);
      }
    }

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
    selectedDocs,
    isDocPicked,
    cleanupFileUrls,
    handleDeleteImage,
    handleDeleteDoc,
    handleChange,
    handleUploadDoc,
    changeBoolean,
    handleSubmit,
    handleUpload,
  };
}

export default useFormData;
