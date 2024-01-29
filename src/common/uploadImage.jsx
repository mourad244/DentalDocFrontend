import React from "react";

const UploadImage = ({
  name,
  label,
  image,
  width,
  widthLabel,
  height,
  type,
  ...rest
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex w-fit flex-wrap">
        <label
          className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]"
          htmlFor={name}
          style={{ width: widthLabel }}
        >
          {label}
        </label>
        <input
          {...rest}
          type={type}
          style={{
            width: 86,
            height: height,
            fontSize: "0.75rem",

            // opacity: 0,
            // position: "absolute",
          }}
          // edit text inside the button
          name={name}
          multiple
        />
      </div>
      <div className="ml-2 mt-2 flex flex-wrap">
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
