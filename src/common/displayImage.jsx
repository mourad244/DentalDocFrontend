import React from "react";

const DisplayImage = ({
  name,
  label,
  images,
  widthLabel,
  height = 200,
  ...rest
}) => {
  return (
    <div className={` flex flex-wrap `}>
      <label
        className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]"
        htmlFor={name}
        style={{ width: widthLabel }}
      >
        {label}
      </label>
      {images.length > 1 ? (
        images.map((img, index) => {
          return (
            <img
              // {...rest}
              className="ml-3 transition-all duration-300 ease-in-out hover:scale-150"
              key={name + index}
              alt={img}
              src={`${process.env.REACT_APP_API_IMAGE_URL}/${img}`}
              height={height + "px"}
              width={height + "px"}
            />
          );
        })
      ) : (
        <img
          className=" ml-3 transition-all duration-300 ease-in-out hover:scale-150"
          src={`${process.env.REACT_APP_API_IMAGE_URL}/${images}`}
          alt={label}
          height={height + "px"}
        />
      )}
    </div>
  );
};

export default DisplayImage;
