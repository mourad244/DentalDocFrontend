import React from "react";

const DisplayImage = ({ name, label, images, height = 200, ...rest }) => {
  return (
    <div className="image-display">
      {images.length > 1 ? (
        images.map((img, index) => {
          return (
            <img
              // {...rest}
              className="hover-zoom"
              key={name + index}
              alt={img}
              src={`${process.env.REACT_APP_API_IMAGE_URL}/${img}`}
              height={height + "px"}
            />
          );
        })
      ) : (
        <img
          className="hover-zoom"
          src={`${process.env.REACT_APP_API_IMAGE_URL}/${images}`}
          alt={label}
          height={height + "px"}
        />
      )}
    </div>
  );
};

export default DisplayImage;
