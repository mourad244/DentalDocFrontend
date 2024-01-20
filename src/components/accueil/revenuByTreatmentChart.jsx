import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function RevenuByTreatmentChart({ data }) {
  // create a chart to display the revenue over time including breakdown by treatment type
  /* const data = [
    { name: "Extraction", montant: 800 },
    { name: "Professional Dental Cleaning", montant: 142.5 },
    { name: "Scaling and Root Planing Per Quadrant", montant: 235 },
    { name: "Dental Sealant Per Tooth", montant: 35 },
    { name: "Tooth Bonding or Dental Bonding Per Tooth", montant: 325 },
    { name: "Tooth Fillings", montant: 162.5 },
    { name: "Root Canal Treatment", montant: 1000 },
    { name: "Dental Bridges", montant: 2875 },
    { name: "Dental Crowns", montant: 1250 },
    { name: "Dentures", montant: 4000 },
    { name: "Custom-Made Mouth Guard", montant: 600 },
    { name: "Dental Implant", montant: 3000 },
    { name: "One-Visit Dental Crown, Inlay, or Onlay", montant: 1750 },
    { name: "One-Visit Dentures Per Plate", montant: 1600 },
    { name: "Periodontal Surgery", montant: 7000 },
    { name: "Full-Mouth Dental Reconstruction", montant: 6000 },
    { name: "Metal Braces", montant: 5000 },
    { name: "Ceramic Braces", montant: 5500 },
    { name: "Lingual Braces", montant: 9.0 },
  ]; */

  const svgRef = useRef();

  useEffect(() => {
    const sortedData = [...data]
      .sort((a, b) => b.montant - a.montant)
      .slice(0, 5);

    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 300;
    const margin = { top: 10, right: 20, bottom: 50, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxYValue = d3.max(sortedData, (d) => d.montant);

    svg.selectAll("*").remove();
    // Define the gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "ageGradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6D9499");
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#87EAE9");
    // ... axis setup ...
    const xScale = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.name))
      // make an order of the data based on the montant
      .range([0, innerWidth])
      .padding(0.2);
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => d.montant) > 0 ? d3.max(data, (d) => d.montant) : 1,
      ])
      .range([innerHeight, 0]);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create and format the y-axis
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(d3.format("d")) // Format as integer
      .tickSize(-innerWidth) // Extend the tick lines across the chart width

      .tickValues(
        maxYValue <= 10
          ? d3.range(0, maxYValue + 1)
          : d3.ticks(0, maxYValue, 5), // For larger numbers, limit the number of ticks
      ); // For small numbers, use every integer

    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .style("font-weight", "bold")
      .style("fill", "white");
    g.select(".domain").style("stroke", "white");
    g.selectAll(".tick line")
      .style("stroke", "white")
      .style("stroke-dasharray", "2,2");
    g.select(".domain").remove();

    // Create the x-axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    xAxis
      .selectAll(".tick text")
      .text((d) => (d.length > 10 ? d.substring(0, 14) + "..." : d));
    // Rotate the x-axis labels
    xAxis
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 0)
      .attr("dy", "1.4em")
      .attr("transform", "rotate(25)")
      .style("text-anchor", "start")
      .style("font-weight", "bold")
      .style("fill", "white");

    xAxis.select(".domain").style("stroke", "white");
    xAxis.selectAll(".tick line").style("stroke", "white");

    // Draw bars
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(d.montant))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.montant))
      .attr("fill", "url(#ageGradient)")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).style("opacity", 0.7);
        d3.select(this).append("title").text(`${d.montant} Dh - ${d.name}`);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).style("opacity", 1);
        d3.select(this).select("title").remove();
      });
  }, [data]);

  return (
    <div className="w-fit">
      <h2 className="text-sm font-bold text-white">Revenu par traitement</h2>
      <div className="revenuByTreatmentChart">
        <svg ref={svgRef} width={300} height={300} />
      </div>
    </div>
  );
}
export default RevenuByTreatmentChart;
