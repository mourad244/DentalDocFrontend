import React /* , { useState } */ from "react";
const SearchBox = ({ value, onChange, width = 170, height = 35 }) => {
  return (
    <div className="flex items-center ">
      <input
        className=" rounded-md bg-[#6d71be47] bg-[#dddbf3] pl-2 pr-3 text-xs font-medium shadow-inner focus:outline-none"
        type="text"
        style={{ width: width, height: height }}
        name="query"
        placeholder="Chercher un nom..."
        value={value}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
      />
      {value.length === 0 ? (
        <svg className="z-1 -ml-8 " width="25" height="20" viewBox="0 0 25 27">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.9364 21.3809C4.89641 21.3809 0 16.5946 0 10.6905C0 4.78628 4.89641 0 10.9364 0C16.9765 0 21.8729 4.78628 21.8729 10.6905C21.8729 13.5934 20.6892 16.2262 18.7678 18.1526C26.0417 25.8529 25.1755 26.144 24.6882 26.832C23.9032 27.2024 23.3888 27.6787 16.9293 19.6344C15.2081 20.7386 13.149 21.3809 10.9364 21.3809ZM10.9364 19.6344C15.9897 19.6344 20.0862 15.6301 20.0862 10.6905C20.0862 5.75082 15.9897 1.74646 10.9364 1.74646C5.88315 1.74646 1.78665 5.75082 1.78665 10.6905C1.78665 15.6301 5.88315 19.6344 10.9364 19.6344Z"
            fill="#1F2037"
          />
        </svg>
      ) : (
        ""
      )}
    </div>
  );
};

export default SearchBox;
