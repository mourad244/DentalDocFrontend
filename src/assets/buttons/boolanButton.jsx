import { React } from "react";
const BooleanButton = ({ label, index, value, handleChangeBoolean }) => {
  return (
    <svg
      className="mt-2 cursor-pointer"
      width="100"
      height="28"
      onClick={() => {
        if (index === "0") return handleChangeBoolean(true);
        if (index === "1") return handleChangeBoolean(false);
      }}
      viewBox="0 0 100 28"
      fill="none"
    >
      <text
        fill={value ? "#455a94" : "#A3A8B6"}
        fontFamily="Roboto"
        fontSize="12"
        fontWeight="bold"
      >
        <tspan x="26" y="16">
          {label}
        </tspan>
      </text>
      {value ? (
        <g filter="url(#filterButton)">
          <circle cx="10" cy="10.5" r="7" fill={"#455a94"} />
        </g>
      ) : (
        <circle cx="10" cy="10.5" r="7" fill={"#A3A8B6"} />
      )}
      <defs>
        <filter
          id="filterButton"
          x="0"
          y="1"
          width="27"
          height="27"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default BooleanButton;
