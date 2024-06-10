import React from "react";
import moment from "moment";

const DateInput = ({
  name,
  label,
  value,
  onChange,
  error,
  width = 170,
  height = 35,
  widthLabel = 96,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex w-fit flex-wrap">
        <label
          className="mr-3 text-right text-xs font-bold leading-9 text-[#72757c]"
          htmlFor={name}
          style={{ width: widthLabel }}
        >
          {label}
        </label>
        <input
          className="rounded-md border-0 bg-[#D6E1E3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner"
          name={name}
          style={{ width, height }}
          id={name}
          type="date"
          placeholder="YYYY-MM-DD"
          value={value ? moment(value).format("YYYY-MM-DD") : ""}
          onChange={onChange}
        />
      </div>
      {error && (
        <div
          className="ml-2 mt-2 flex text-xs text-red-500"
          style={{ width: `calc(${width + widthLabel}px - 20px)` }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default DateInput;
