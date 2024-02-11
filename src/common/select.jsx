import React from "react";

const Select = ({
  name,
  label,
  options = [],
  error,
  widthLabel,
  width = "auto",
  height,
  ...rest
}) => {
  return (
    <div className=" flex flex-col">
      <div className=" flex w-fit flex-wrap">
        <label
          className="mr-3 text-right text-xs font-bold leading-9 text-[#72757c]"
          htmlFor={name}
          style={{ width: widthLabel }}
        >
          {label}
        </label>
        <select
          className=" w-24 rounded-md	border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
          {...rest}
          id={name}
          name={name}
          style={{ width: width, height: height }}
          // if value is object then select ._id if value is string then select value
        >
          <option value="" />
          {options.map((option) => {
            return (
              <option
                key={option._id || option.nom}
                value={option._id || option}
              >
                {option.nom}
              </option>
            );
          })}
        </select>
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

export default Select;
