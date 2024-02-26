import React from "react";
import "./booleanSelect.css";
import BooleanButton from "../assets/buttons/boolanButton";
const BooleanSelect = ({
  name,
  value,
  changeBoolean,
  label,
  label1,
  label2,
  width,
  height,
  widthLabel,
  error,
  ...rest
}) => {
  const handleChangeBoolean = (x) => {
    changeBoolean(x);
  };
  if (value === "" || value === undefined || value === null)
    return (
      <div className="flex w-max flex-wrap">
        <label
          className="mr-3  text-right text-xs font-bold leading-[36px] text-[#72757c]"
          htmlFor={name}
          style={{ width: widthLabel }}
        >
          {label}
        </label>
        <BooleanButton
          label={label1}
          index={"0"}
          value={false}
          width={width}
          height={height}
          handleChangeBoolean={handleChangeBoolean}
        />
        <BooleanButton
          label={label2}
          index={"1"}
          width={width}
          height={height}
          value={false}
          handleChangeBoolean={handleChangeBoolean}
        />
      </div>
    );
  else
    return (
      <div className="flex w-max flex-wrap">
        <label
          className="mr-3 text-right text-xs font-bold leading-[36px] text-[#72757c]"
          htmlFor={name}
          style={{ width: widthLabel }}
        >
          {label}
        </label>
        <BooleanButton
          label={label1}
          index={"0"}
          width={width}
          height={height}
          value={value}
          handleChangeBoolean={handleChangeBoolean}
        />
        <BooleanButton
          label={label2}
          index={"1"}
          height={height}
          width={width}
          value={!value}
          handleChangeBoolean={handleChangeBoolean}
        />
      </div>
    );
};
export default BooleanSelect;
