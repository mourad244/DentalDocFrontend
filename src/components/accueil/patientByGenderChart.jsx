import React from "react";
import * as d3 from "d3";

function PatientByGenderChart() {
  const data = [
    { name: "Homme", value: 60 },
    { name: "Femme", value: 30 },
  ];
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const width = 300;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius); // Adjust for donut

  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(["url(#gradient1)", "url(#gradient2)"]); // Use gradient URLs

  const pie = d3.pie().value((d) => d.value);

  const getContrastYIQ = (hexcolor) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  return (
    <div>
      <h2 className="text-center text-sm font-bold text-white">
        Patient's Gender
      </h2>
      <svg width={width} height={height}>
        <defs>
          {/* Gradient for "Homme" */}
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#52FAFF" }} />
            <stop offset="100%" style={{ stopColor: "#21AEB4" }} />
          </linearGradient>
          {/* Gradient for "Femme" */}
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#D9D9D9" }} />
            <stop offset="100%" style={{ stopColor: "#A3C2C5" }} />
          </linearGradient>
        </defs>
        {total === 0 ? (
          <text
            transform={`translate(${width / 2}, ${height / 2})`}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="white"
            fontSize="20px"
            fontWeight="bold"
          >
            No Data
          </text>
        ) : (
          <>
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
                {pie(data).map((d, i) => (
                  <g key={d.data.name}>
                    <path
                      fill={colorScale(d.data.name)}
                      d={arc(d)}
                      // onMouseOver={(event) => {
                      //   // Show tooltip on mouse over
                      //   const tooltip = d3.select("#tooltip");
                      //   tooltip.style("display", "block");
                      //   tooltip.text(`${d.data.name}: ${d.data.value}`);
                      //   tooltip.style("left", event.clientX + "px");
                      //   tooltip.style("top", event.clientY + "px");
                      // }}
                      // onMouseOut={() => {
                      //   // Hide tooltip on mouse out
                      //   d3.select("#tooltip")

                      //     .transition()
                      //     .duration(500)
                      //     .style("display", "none");
                      // }}
                    >
                      <title>{`${d.data.value}`}</title>
                    </path>
                    <text
                      transform={`translate(${arc.centroid(d)[0]}, ${
                        arc.centroid(d)[1] - 6
                      })`}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill={getContrastYIQ(colorScale(d.data.name))}
                      fontSize="12px"
                      fontWeight="bold"
                    >
                      {d.data.name}
                    </text>
                    <text
                      transform={`translate(${arc.centroid(d)[0]}, ${
                        arc.centroid(d)[1] + 10
                      })`}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill={getContrastYIQ(colorScale(d.data.name))}
                      fontSize="14px"
                      fontWeight="bold"
                    >
                      {`${((d.data.value / total) * 100).toFixed(1)}%`}
                    </text>
                  </g>
                ))}
              </g>
            </g>
            <text
              transform={`translate(${innerWidth / 2 + 20}, ${
                innerHeight / 2 + 20
              })`}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="white"
              fontSize="20px"
              fontWeight="bold"
            >
              Total: {total}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
export default PatientByGenderChart;
