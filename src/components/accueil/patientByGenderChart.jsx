import React from "react";
import * as d3 from "d3";

function PatientByGenderChart() {
  // create a cercle chart having porcentage of homme and femme
  const data = [
    { name: "Homme", value: 20 },
    { name: "Femme", value: 40 },
  ];
  const width = 300;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(d3.schemeSet2);
  const pie = d3.pie().value((d) => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  return (
    <div>
      <h2 className="text-xl font-bold">Patient's Gender</h2>
      <svg width={width + 30} height={height + 60}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g transform={`translate(${innerWidth / 2},${innerHeight / 2})`}>
            {pie(data).map((d) => (
              <path
                key={d.data.name}
                fill={colorScale(d.data.name)}
                d={arc(d)}
              />
            ))}
          </g>
          <g transform={`translate(${innerWidth / 2},${innerHeight / 2})`}>
            {pie(data).map((d) => (
              <text
                key={d.data.name}
                transform={`translate(${arc.centroid(d)})`}
                textAnchor="middle"
                fontSize="10"
              >
                {d.data.name}
              </text>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
export default PatientByGenderChart;
