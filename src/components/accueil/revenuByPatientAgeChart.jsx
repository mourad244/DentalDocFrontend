import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function RevenuByPatientAgeChart() {
  // create an horizontal line chart to visualize payment by age distribution
  //   create a chart for age distribution ( - Children (0-12 years)  - Teens (13-19 years)  - Young Adults (20-29 years)   - Adults (30-44 years)  - Middle-aged Adults (45-59 years)  - Seniors (60+ years) depending on the age of the patient

  const data = [
    { name: "Children", value: 400 },
    { name: "Teens", value: 300 },
    { name: "Young Adults", value: 300 },
    { name: "Adults", value: 200 },
    { name: "Middle-aged Adults", value: 278 },
    { name: "Seniors", value: 189 },
  ];

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = svg.attr("width");
    const height = svg.attr("height");

    const margin = { top: 20, right: 20, bottom: 20, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.1);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g").call(d3.axisLeft(yScale));
    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", -10)
            .attr("y", y)
            .attr("dy", dy + "em");

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", -10)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    }

    g.selectAll(".tick text").call(wrap, margin.left - 10);
    g.append("g")
      .call(d3.axisBottom(xScale))
      .attr("transform", `translate(0, ${innerHeight})`);

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => yScale(d.name))
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth());
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Revenu by patient age</h2>
      <div className="revenuByPatientAgeChart">
        <svg ref={svgRef} width="500" height="400" />
      </div>
    </div>
  );
}

export default RevenuByPatientAgeChart;
