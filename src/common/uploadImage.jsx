import React from "react";

const UploadImage = ({ name, label, image, height, type, ...rest }) => {
  return (
    <div className="form-file">
      <div className="upload-file">
        <label className="upload-file-label" htmlFor={name}>
          {label}
        </label>
        <input {...rest} type={type} name={name} multiple />
      </div>
      <div className="image-file-form">
        {image
          ? image.map((url, index) => (
              <img alt={url} key={index} src={url} height={height + "px"} />
            ))
          : ""}
      </div>
    </div>
  );
};

export default UploadImage;
