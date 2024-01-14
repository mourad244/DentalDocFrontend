import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function DentalProcedureChart() {
  // create for a linear chart to display the common procedures performed
  const data = [
    { name: "Extraction", value: 30 },
    { name: "Filling", value: 24 },
    { name: "Cleaning", value: 20 },
    { name: "Root Canal", value: 19 },
    { name: "Crown", value: 13 },
    { name: "Implant", value: 11 },
    { name: "Other", value: 3 },
  ];
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svgRef = useRef();
  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [
        0,
        0,
        width + margin.left + margin.right,
        height + margin.top + margin.bottom,
      ])
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(data.map((d) => d.name));

    const y = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(data, (d) => d.value)]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    const bars = svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar");

    bars
      .append("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "steelblue");
    bars
      .append("text")
      .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .text((d) => d.value)
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "12px");
  }, [data]);

  return (
    <div className="w-auto">
      <h2 className="text-xl font-bold">Common procedures</h2>
      <svg ref={svgRef} />
    </div>
  );
}

export default DentalProcedureChart;
