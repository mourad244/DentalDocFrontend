import React from "react";

function VerticalDashedLine({ height = 335 }) {
  return (
    <svg width="1" height={height} viewBox={`0 0 1 ${height}`}>
      <line
        x1="0.5"
        y1={height}
        x2="0.500009"
        y2="-2.18557e-08"
        stroke="#818181"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export default VerticalDashedLine;
