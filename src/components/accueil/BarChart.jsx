import React from "react";
import * as d3 from "d3";

function BarChart() {
  //   create a chart for age distribution (- Infants and Toddlers (0-3 years)  - Children (4-12 years)  - Teens (13-19 years)  - Young Adults (20-29 years)   - Adults (30-44 years)  - Middle-aged Adults (45-59 years)  - Seniors (60+ years) depending on the age of the patient
  const data = [
    { name: "Infants", value: 20 },
    { name: "Toddlers", value: 40 },
    { name: "Children", value: 30 },
    { name: "Teens", value: 40 },
    { name: "Young Adults", value: 20 },
    { name: "Adults", value: 40 },
    { name: "Middle-aged Adults", value: 60 },
    { name: "Seniors", value: 40 },
  ];
  const width = 500;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, innerWidth])
    .padding(0.2);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([innerHeight, 0]);
  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(d3.schemeSet2);
  return (
    <svg width={width + 30} height={height + 60}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {xScale.domain().map((tickValue) => (
          <g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
            <line y2={innerHeight} stroke="black" strokeDasharray="4" />
            <text
              style={{ textAnchor: "start" }}
              x={xScale.bandwidth() / 2}
              y={innerHeight + 4}
              dy=".72em"
              transform={`rotate(25, ${xScale.bandwidth() / 2}, ${
                innerHeight + 3
              })`}
            >
              {tickValue}
            </text>
          </g>
        ))}
        {yScale.ticks().map((tickValue) => (
          <g key={tickValue} transform={`translate(0,${yScale(tickValue)})`}>
            <line x2={innerWidth} stroke="black" strokeDasharray="4" />
            <text style={{ textAnchor: "end" }} x={-3} dy=".32em">
              {tickValue}
            </text>
          </g>
        ))}
        {data.map((d) => (
          <rect
            key={d.name}
            x={xScale(d.name)}
            y={yScale(d.value)}
            width={xScale.bandwidth()}
            height={innerHeight - yScale(d.value)}
            fill={colorScale(d.name)}
          />
        ))}
      </g>
    </svg>
  );
}

export default BarChart;
