import React from "react";
const Input = ({
  name,
  label,
  error,
  width,
  widthLabel,
  height,
  disabled,
  ...rest
}) => {
  return (
    <div className=" flex flex-col">
      <div className="flex w-fit flex-wrap">
        <label
          className={`mr-3  text-right text-xs font-bold leading-9 text-[#72757c]`}
          htmlFor={name}
          style={{ width: widthLabel }}
        >
          {label}
        </label>
        <input
          className={`rounded-md	border-0  pl-3 pr-3 text-xs font-bold text-[#1f2037]  ${
            disabled ? "bg-[#b1b1b1]" : "bg-[#dddbf3] shadow-inner"
          }`}
          {...rest}
          name={name}
          id={name}
          style={{ width: width, height: height }}
        />
      </div>
      {error && (
        <div
          className={`ml-auto  mt-2 flex w-[${
            width + widthLabel
          }]px text-xs text-red-500`}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
