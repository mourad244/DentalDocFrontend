import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function PatientRetentionChart() {
  const svgRef = useRef();
  useEffect(() => {
    const data = [
      { name: "New", value: 400 },
      { name: "Returning", value: 300 },
    ];
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    d3.select(svgRef.current).selectAll("*").remove();
    const color = d3.scaleOrdinal().range(["#98abc5", "#8a89a6"]);

    const radius = Math.min(width, height) / 2;

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 1);

    const arcs = pie(data);

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    svg
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d) => color(d.data.name))
      .attr("d", arc);
    svg
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => `${d.data.name}: ${d.data.value}`)
      .style("fill", "white")
      .style("font-size", 14);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Patient retention</h2>
      <div className="patientRetentionChart">
        <svg ref={svgRef} width="500" height="100" />
      </div>
    </div>
  );
}

export default PatientRetentionChart;
