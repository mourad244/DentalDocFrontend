import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function AppointementTotalChart() {
  // i want to create a cerle chart with the number of total appointements scheduled, canceled and missed,

  const data = [
    { name: "scheduled", value: 50 },
    { name: "canceled", value: 20 },
    { name: "missed", value: 10 },
    { name: "walk-ins", value: 15 },
  ];
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svgRef = useRef();
  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    const color = d3
      .scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);
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
  }, [data]);

  return (
    <div>
      <h2 className="text-xl font-bold">Total appointements</h2>
      <div className="appointementTotalChart">
        <svg ref={svgRef} />
      </div>
    </div>
  );
}
export default AppointementTotalChart;
