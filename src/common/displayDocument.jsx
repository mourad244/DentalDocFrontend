import React, { useState } from "react";
import pdfIcon from "../assets/icons/pdf-icon.png";
import wordIcon from "../assets/icons/word-icon.jpg";
import { v4 as uuidv4 } from "uuid";
const DisplayDocument = ({
  name,
  label,
  documents,
  height = 200,
  deleteDocument,
  isDelete = true,
  widthLabel,
  ...rest
}) => {
  const [indexBluredDocument, setIndexBluredDocument] = useState([]);
  const handleDocumentDelete = (name, e, index) => {
    e.preventDefault();
    indexBluredDocument.includes(index)
      ? setIndexBluredDocument(indexBluredDocument.filter((i) => i !== index))
      : setIndexBluredDocument([...indexBluredDocument, index]);

    deleteDocument(name, e, index);
  };
  if (!documents || documents.length === 0) return null;
  return (
    <div className={` flex`}>
      <label
        className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]"
        htmlFor={name}
        style={{ width: widthLabel }}
      >
        {label}
      </label>
      <div>
        {documents.map((doc, index) => {
          let founded = indexBluredDocument.includes(index);
          const docName = doc.split("/")[1].split("-")[0];
          const docType = doc.split("/")[1].split("-")[1];
          const docDate = doc.split("/")[1].split("-")[2];

          if (founded) {
            return (
              <div key={index} className="mt-3 flex  flex-row">
                <div className="flex">
                  <label
                    htmlFor=""
                    className="m-auto ml-1 text-[11px] text-slate-500 line-through"
                  >
                    {`${docName}.${docType}`}
                  </label>
                  <label
                    htmlFor=""
                    className="m-auto ml-1 text-[11px] text-slate-500 line-through"
                  >
                    {`${new Date(parseInt(docDate)).getDate()}-${
                      new Date(parseInt(docDate)).getMonth() + 1
                    }-${new Date(parseInt(docDate)).getFullYear()}`}
                  </label>
                  <button
                    className="m-auto   ml-1 h-7 w-6 rounded-md bg-green-500 font-bold text-white"
                    onClick={(e) => {
                      handleDocumentDelete(doc, e, index);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div key={index} className="mt-3 flex  flex-row">
              <div className="flex">
                {/* access  to the file*/}
                <a
                  href={process.env.REACT_APP_API_IMAGE_URL + "/" + doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex"
                >
                  <img
                    src={docType === "pdf" ? pdfIcon : wordIcon}
                    alt="file"
                    className="h-10 w-10"
                  />
                  <label htmlFor="" className="m-auto ml-1 cursor-pointer">
                    {`${docName}.${docType}`}
                  </label>
                </a>

                <label
                  htmlFor=""
                  className="m-auto ml-1 text-[11px] text-slate-500"
                >
                  {`${new Date(parseInt(docDate)).getDate()}-${
                    new Date(parseInt(docDate)).getMonth() + 1
                  }-${new Date(parseInt(docDate)).getFullYear()}`}
                </label>
                <button
                  className="m-auto   ml-1 h-7 w-6 rounded-md bg-red-500 font-bold text-white"
                  onClick={(e) => {
                    handleDocumentDelete(doc, e, index);
                  }}
                >
                  x
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DisplayDocument;
