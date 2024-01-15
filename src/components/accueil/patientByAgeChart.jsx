import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function PatientByAgeChart({ data }) {
  // const data = [
  //   { name: "Children", number: 400 },
  //   { name: "Teens", number: 300 },
  //   { name: "Young Adults", number: 300 },
  //   { name: "Adults", number: 200 },
  //   { name: "Middle-aged Adults", number: 278 },
  //   { name: "Seniors", number: 189 },
  // ];
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxYValue = d3.max(data, (d) => d.number);

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

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(d3.schemeSet2);

    // Clear the existing SVG content
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create and format the y-axis
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(d3.format("d")) // Format as integer
      .tickValues(
        maxYValue <= 10
          ? d3.range(0, maxYValue + 1)
          : d3.ticks(0, maxYValue, 5), // For larger numbers, limit the number of ticks
      ); // For small numbers, use every integer

    g.append("g").call(yAxis);
    // Create the x-axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Rotate the x-axis labels
    xAxis
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(25)")
      .style("text-anchor", "start");

    // Draw bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(Math.max(0, d.number)))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => Math.max(0, innerHeight - yScale(d.number)))
      .attr("fill", (d) => colorScale(d.name));
  }, [data]); // Redraw chart when data

  return (
    <div>
      <h2 className="text-xl font-bold">Patients by age</h2>
      <div className="patientByAgeChart">
        <svg ref={svgRef} width="400" height="400" />
      </div>
    </div>
  );
}

export default PatientByAgeChart;
