import { React } from "react";

const SearchButton = ({ handleSearch }) => {
  return (
    <svg
      onClick={() => handleSearch()}
      width="47"
      height="48"
      viewBox="0 0 47 48"
    >
      <circle cx="23.5" cy="23.5" r="23.5" fill="#4F6874" />
      <g filter="url(#filterSearch)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.6296 32.1718C12.4655 32.1718 7.12109 26.1411 7.12109 19.8785C7.12109 12.92 12.4655 7.12122 19.6296 7.12122C26.7937 7.12122 32.3697 12.7047 32.3697 19.8785C32.3697 23.1736 30.9344 26.2896 28.5845 28.56C28.5845 28.56 33.7596 33.7955 37.6974 37.7386C37.9291 38.4345 37.2341 39.3623 36.3076 39.1303C34.2228 37.0428 26.9649 29.8883 26.9649 29.8883C24.9061 31.3138 22.3853 32.1718 19.6296 32.1718ZM8.74257 19.8785C8.64485 13.6158 13.4758 8.51292 19.6296 8.51292C25.5251 8.51292 30.4298 12.9727 30.4298 19.5595C30.4298 26.1462 25.1889 30.7801 19.6296 30.7801C14.0703 30.7801 8.84028 26.1411 8.74257 19.8785Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filterSearch"
          x="3.12109"
          y="7.12122"
          width="38.6211"
          height="40.0455"
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
export default SearchButton;
