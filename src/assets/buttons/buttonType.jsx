import { React } from "react";
import "./buttonType.css";
const ButtonType = (text, isActive) => {
  return isActive ? (
    <svg
      width="110"
      height="20"
      className="date-button"
      viewBox="0 0 100 24"
      fill="none"
    >
      <g id="button-date-active" filter="url(#filterButtonDate)">
        <text fill="#4F6874" fontSize="12" fontWeight="bold">
          <tspan x="27" y="17.6523">
            {text.toLocaleUpperCase()}
          </tspan>
        </text>
        <g id="Group_14" filter="url(#filter-date-button)">
          <circle
            id="6"
            cx="12"
            cy="12"
            r="11"
            fill="white"
            stroke="#4F6874"
            strokeWidth="2"
          />
          <path
            id="Vector"
            d="M25.9485 2.13888C24.9402 0.574555 11.3284 12.7415 11.3284 12.7415C11.3284 12.7415 6.79116 7.70064 5.27873 8.74381C3.76631 9.78698 8.80777 18.8247 10.8244 18.9985C12.841 19.1724 26.9568 3.70321 25.9485 2.13888Z"
            fill="#4F6874"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filterButtonDate"
          x="0"
          y="0"
          width="95.9707"
          height="28"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
        <filter
          id="filter-date-button"
          x="0"
          y="0"
          width="26"
          height="24"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="3"
            operator="erode"
            in="SourceAlpha"
            result="effect1_innerShadow"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
    </svg>
  ) : (
    <svg
      width="110"
      height="20"
      className="date-button"
      viewBox="0 0 100 24"
      fill="none"
    >
      <g id="button-date">
        <text fill="#4F6874" fontSize="12" fontWeight="bold">
          <tspan x="27" y="17.6523">
            {text.toLocaleUpperCase()}
          </tspan>
        </text>
        <g id="Group_15" filter="url(#filter-button-inactif)">
          <circle
            id="Ellipse 6"
            cx="12"
            cy="12"
            r="11"
            fill="white"
            stroke="#4F6874"
            strokeWidth="2"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter-button-inactif"
          x="0"
          y="0"
          width="26"
          height="24"
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
          <feMorphology
            radius="3"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow"
          />
          <feOffset dy="20" />
          <feGaussianBlur stdDeviation="20" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.34 0"
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

export default ButtonType;
