import { React } from "react";
const typeAdherenceButton = (text, isActive) => {
  return !isActive ? (
    <svg
      height="28"
      width="180"
      /* width="203" height="28" viewBox="0 0 203 28" */
    >
      <text fill="#A3A8B6" fontSize="20" fontWeight="bold">
        <tspan x="25" y="20">
          {text}
        </tspan>
      </text>
      <circle cx="9.5" cy="14.5" r="9.5" fill="#A3A8B6" />
    </svg>
  ) : (
    <svg
      height="28"
      width="180" /*  width="203" height="28" viewBox="0 0 203 28" */
    >
      <g filter="url(#filter0_i)">
        <text fill="#455a94" fontSize="20" fontWeight="bold">
          <tspan x="25" y="20">
            {text}
          </tspan>
        </text>
        <circle cx="9.5" cy="14.5" r="9.5" fill="#455a94" />
      </g>
      <defs>
        <filter
          id="filter0_i"
          x="0"
          y="3"
          width="177.453"
          height="23.2344"
          filterUnits="userSpaceOnUse"
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
  );
};

export default typeAdherenceButton;
