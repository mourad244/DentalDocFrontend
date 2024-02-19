import { React } from "react";

const APayer = (text) => {
  return (
    <svg width="200" height="188" viewBox="0 0 200 188" fill="none">
      <g filter="url(#filterAPayer)">
        <path
          d="M4 28C4 12.536 16.536 0 32 0H158C173.464 0 186 12.536 186 28V152C186 167.464 173.464 180 158 180H32C16.536 180 4 167.464 4 152V28Z"
          fill="#8FDBEC"
        />
      </g>
      <g filter="url(#filterAPayer1)">
        <path
          d="M4 27C4 12.0883 16.0883 3.39575e-06 31 7.58461e-06L159 4.35413e-05C173.912 4.77301e-05 186 12.0884 186 27V63.0001H4V27Z"
          fill="#4F6874"
        />
      </g>
      <g filter="url(#filterAPayer2)">
        <text fill="white" fontSize="18" fontWeight="bold">
          <tspan x="39" y="41.3047">
            Total des actes
          </tspan>
        </text>
      </g>
      <g filter="url(#filter3_d_27:238)">
        <text fill="white" fontSize="18" fontWeight="bold">
          <tspan x="39" y="123.305">
            {text}
          </tspan>
        </text>
      </g>
      <defs>
        <filter
          id="filterAPayer"
          x="0"
          y="0"
          width="200"
          height="188"
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
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_27:238"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_27:238"
            result="shape"
          />
        </filter>
        <filter
          id="filterAPayer1"
          x="0"
          y="0"
          width="200"
          height="71"
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
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_27:238"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_27:238"
            result="shape"
          />
        </filter>
        <filter
          id="filterAPayer2"
          x="31.123"
          y="15.4062"
          width="125.896"
          height="41.2754"
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
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_27:238"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_27:238"
            result="shape"
          />
        </filter>
        <filter
          id="filter3_d_27:238"
          x="36.2305"
          y="96"
          width="119.428"
          height="35.3516"
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
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_27:238"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_27:238"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default APayer;
