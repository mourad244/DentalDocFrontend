import { useState, useCallback } from "react";
import Joi from "joi-browser";

function useFormData(initialValues, schema, onSubmit) {
  const [data, setData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [fileData, setFileData] = useState({}); // To store actual file objects for submission
  const [filePreviews, setFilePreviews] = useState({}); // To store URLs for previewing files
  const [loading, setLoading] = useState(false);

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
    const validationErrors = validate();
    setErrors(validationErrors || {});

    if (validationErrors) return;

    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle additional error logic here if needed
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
  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    const actualValue =
      type === "checkbox" ? checked : type === "file" ? files : value;
    const errorMessage = validateProperty(name, actualValue);

    // Handle files specifically
    if (type === "file" && files.length > 0) {
      const fileList = Array.from(files);
      const fileUrls = fileList.map((file) => URL.createObjectURL(file));
      setFilePreviews((prev) => ({ ...prev, [name]: fileUrls }));
      setFileData((prev) => ({ ...prev, [name]: files }));
    }

    const newErrors = { ...errors, [name]: errorMessage };
    if (!errorMessage) delete newErrors[name];

    const newData = {
      ...data,
      [name]: type === "file" ? undefined : actualValue,
    }; // Do not store file in data state
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

  return {
    data,
    errors,
    validate,
    fileData,
    updateData,
    loading,
    filePreviews,
    cleanupFileUrls,
    handleChange,
    changeBoolean,
    handleSubmit,
  };
}

export default useFormData;
