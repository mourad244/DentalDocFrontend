import { React } from "react";

const ButtonPage = (page, isActive) => {
  return isActive ? (
    <svg width="40" height="40">
      <g filter="url(#filter-active-page)">
        <rect width="40" height="40" rx="20" fill="#6d71be47" />
      </g>
      <text fill="#474a52" fontSize="16" fontWeight="bold">
        <tspan x="8" y="28">
          {page}
        </tspan>
      </text>
      <defs>
        <filter
          id="filter-active-page"
          x="0"
          y="0"
          width="40"
          height="44"
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
      </defs>
    </svg>
  ) : (
    <svg width="40" height="40" fill="none">
      <g filter="url(#filter-inactive-page)">
        <rect width="40" height="40" rx="20" fill="#4F6874" />
      </g>
      {/* <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="19"
        stroke="#707888"
        strokeWidth="2"
      /> */}
      <text fill="#ffffff" fontSize="16" fontWeight="bold" letterSpacing="0em">
        <tspan x="8" y="28">
          {page}
        </tspan>
      </text>
      <defs>
        <filter
          id="filter-inactive-page"
          x="0"
          y="0"
          width="40"
          height="44"
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
          {/* <feOffset dy="4" /> */}
          {/* <feGaussianBlur stdDeviation="2" /> */}
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
    </svg>
  );
};

export default ButtonPage;
