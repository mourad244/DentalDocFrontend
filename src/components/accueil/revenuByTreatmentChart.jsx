import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function RevenuByTreatmentChart() {
  // create a chart to display the revenue over time including breakdown by treatment type
  const data = [
    { name: "Extraction", value: 800 },
    { name: "Professional Dental Cleaning", value: 142.5 },
    { name: "Scaling and Root Planing Per Quadrant", value: 235 },
    { name: "Dental Sealant Per Tooth", value: 35 },
    { name: "Tooth Bonding or Dental Bonding Per Tooth", value: 325 },
    { name: "Tooth Fillings", value: 162.5 },
    { name: "Root Canal Treatment", value: 1000 },
    { name: "Dental Bridges", value: 2875 },
    { name: "Dental Crowns", value: 1250 },
    { name: "Dentures", value: 4000 },
    { name: "Custom-Made Mouth Guard", value: 600 },
    { name: "Dental Implant", value: 3000 },
    { name: "One-Visit Dental Crown, Inlay, or Onlay", value: 1750 },
    { name: "One-Visit Dentures Per Plate", value: 1600 },
    { name: "Periodontal Surgery", value: 7000 },
    { name: "Full-Mouth Dental Reconstruction", value: 6000 },
    { name: "Metal Braces", value: 5000 },
    { name: "Ceramic Braces", value: 5500 },
    { name: "Lingual Braces", value: 9.0 },
  ];
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
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

    svg
      .selectAll("text")
      .style("text-anchor", "start") // Anchor text from the start
      .attr("dx", "-.6em") // No horizontal adjustment
      .attr("dy", "1em") // Slight vertical adjustment for better visibility
      .attr("transform", (d) => `translate(${x.bandwidth() / 2}, 0) rotate(35)`) // Position in the middle and rotate by 25 degrees
      .text((d) => (d.length > 10 ? d.slice(0, 10) + "..." : d));
    svg
      .selectAll("text")
      .append("title")
      .text((d) => d);

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
      .style("fill", "steelblue");

    bars
      .append("text")
      .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .text((d) => d.value)
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "10px");
  }, [data]);

  return (
    <div>
      <h2 className="text-xl font-bold">Revenu par traitement</h2>
      <div className="revenuByTreatmentChart">
        <svg ref={svgRef} />
      </div>
    </div>
  );
}
export default RevenuByTreatmentChart;
