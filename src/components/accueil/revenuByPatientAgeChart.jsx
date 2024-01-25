import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function RevenuByPatientAgeChart({ data }) {
  // create an horizontal line chart to visualize payment by age distribution
  //   create a chart for age distribution ( - Children (0-12 years)  - Teens (13-19 years)  - Young Adults (20-29 years)   - Adults (30-44 years)  - Middle-aged Adults (45-59 years)  - Seniors (60+ years) depending on the age of the patient

  // const data = [
  //   { name: "60 +", number: 189 },
  //   { name: "45-59", number: 278 },
  //   { name: "30-44", number: 200 },
  //   { name: "20-29", number: 300 },
  //   { name: "13-19", number: 300 },
  //   { name: "0-12", number: 400 },
  // ];

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll("*").remove();
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

    const xScale = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          1,
          d3.max(data, (d) => d.number),
        ),
      ]) // Ensure the domain starts at 0 and ends at least at 1
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.1);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const yAxis = g.append("g").call(d3.axisLeft(yScale).tickSize(-innerWidth));

    yAxis
      .selectAll(".tick text")
      .attr("fill", "white")
      .style("font-weight", "bold");

    yAxis.selectAll(".tick line").style("display", "none");
    yAxis.select(".domain").remove();

    const xAxis = d3.axisBottom(xScale);
    xAxis
      .tickFormat(d3.format("d")) // Format as integer
      .tickSize(-innerHeight) // Extend the tick lines across the chart width
      .tickValues(
        d3.max(data, (d) => d.number) <= 10
          ? d3.range(0, d3.max(data, (d) => d.number) + 1)
          : d3.ticks(
              0,
              d3.max(data, (d) => d.number),
              5,
            ),
      );
    // change the lines colors to white

    // Append and call xAxis
    g.append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`)
      .selectAll("text")
      .style("font-weight", "bold")
      .style("fill", "white");
    g.select(".domain").style("stroke", "white");
    g.selectAll(".tick line")
      .style("stroke", "white")
      .style("stroke-dasharray", "2,2");
    g.select(".domain").remove();

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => yScale(d.name))
      .attr("width", (d) => (d.number ? xScale(d.number) : 0)) // Set width to 0 if number is null or 0
      .attr("height", yScale.bandwidth())
      .attr("fill", "url(#ageGradient)")
      .on("mouseover", function (event, d) {
        if (d.number) {
          d3.select(this).transition().duration(200).style("opacity", 0.7);
          d3.select(this).append("title").text(`${d.number}`);
        }
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).style("opacity", 1);
        d3.select(this).select("title").remove();
      });
  }, [data]);

  return (
    <div className="w-fit">
      <h2 className="text-center text-sm font-bold text-white">
        by patient age
      </h2>
      <div className="revenuByPatientAgeChart">
        <svg ref={svgRef} width="300" height="300" />
      </div>
    </div>
  );
}

export default RevenuByPatientAgeChart;
