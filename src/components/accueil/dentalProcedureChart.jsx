import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function DentalProcedureChart({ data }) {
  // create for a linear chart to display the common procedures performed
  // const data = [
  //   { name: "Extraction", number: 30 },
  //   { name: "Filling", number: 24 },
  //   { name: "Cleaning", number: 20 },
  //   { name: "Root Canal", number: 19 },
  //   { name: "Crown", number: 13 },
  //   { name: "Implant", number: 11 },
  //   { name: "Other", number: 3 },
  // ];

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 300;
    const margin = { top: 10, right: 20, bottom: 40, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxYValue = d3.max(data, (d) => d.number);
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
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.2);
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => d.number) > 0 ? d3.max(data, (d) => d.number) : 1,
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
      .style("font-size", "8px")
      .style("fill", "white");

    xAxis.select(".domain").style("stroke", "white");
    xAxis.selectAll(".tick line").style("stroke", "white");

    // Draw bars
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(d.number))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.number))
      .attr("fill", "url(#ageGradient)")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).style("opacity", 0.7);
        d3.select(this).append("title").text(`[${d.number}] ${d.name}`);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).style("opacity", 1);
        d3.select(this).select("title").remove();
      });
  }, [data]);

  return (
    <div className="w-auto">
      <h2 className="text-sm font-bold text-white">Traitements communs</h2>
      <svg ref={svgRef} width={400} height={300} />
    </div>
  );
}

export default DentalProcedureChart;
