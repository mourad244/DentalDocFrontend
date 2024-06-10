import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const DisplayImage = ({
  name,
  label,
  images,
  height = 200,
  deleteImage,
  isDelete = true,
  widthLabel,
  ...rest
}) => {
  const [indexBluredImage, setIndexBluredImage] = useState([]);
  const handleImageDelete = (name, e, index) => {
    e.preventDefault();
    indexBluredImage.includes(index)
      ? setIndexBluredImage(indexBluredImage.filter((i) => i !== index))
      : setIndexBluredImage([...indexBluredImage, index]);

    deleteImage(name, e, index);
  };
  if (!images || images.length === 0) return null;
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
            <div className="flex flex-col items-center" key={uuidv4()}>
              <img
                // {...rest}
                className={`${
                  !indexBluredImage.includes(index) ? "" : "blur-lg"
                } ml-3 transition-all duration-300 ease-in-out hover:scale-150`}
                alt={img}
                src={`${process.env.REACT_APP_API_IMAGE_URL}/${img}`}
                height={height + "px"}
                width={height + "px"}
              />
              {isDelete ? (
                <button
                  className={`${
                    !indexBluredImage.includes(index)
                      ? "bg-red-500"
                      : "bg-green-500"
                  } w-fit rounded-md p-2 text-xs font-bold text-white shadow-md
                 `}
                  onClick={(e) => {
                    handleImageDelete(name, e, index);
                  }}
                >
                  {!indexBluredImage.includes(index) ? "-" : "+"}
                </button>
              ) : (
                ""
              )}
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center">
          <img
            className={`${
              !indexBluredImage.includes(0) ? "" : "blur-sm"
            }  ml-3 transition-all duration-300 ease-in-out hover:scale-150`}
            src={`${process.env.REACT_APP_API_IMAGE_URL}/${images}`}
            alt={label}
            height={height + "px"}
            width={height + "px"}
          />
          {isDelete ? (
            <button
              className={`${
                !indexBluredImage.includes(0) ? "bg-red-500" : "bg-green-500"
              } " w-fit rounded-md p-2 text-xs font-bold text-white shadow-md`}
              onClick={(e) => handleImageDelete(name, e, 0)}
            >
              {!indexBluredImage.includes(0) ? "-" : "+"}
            </button>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};
export default DisplayImage;
