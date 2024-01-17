import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function AppointementTotalChart() {
  // i want to create a cerle chart with the number of total appointements scheduled, canceled and missed,

  const data = [
    { name: "Scheduled", value: 50 },
    { name: "Canceled", value: 20 },
    { name: "Missed", value: 10 },
    { name: "Walk-ins", value: 15 },
  ];
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 400 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

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
      .selectAll(".arc")
      .data(arcs)
      .join("g")
      .attr("class", "arc")
      .each(function (d) {
        const container = d3.select(this);
        container
          .append("path")
          .attr("fill", (d) => color(d.data.name))
          .attr("d", arc)
          .on("mouseover", (event, d) => {
            const tooltip = d3.select("#tooltip");
            tooltip
              .style("display", "block")
              .text(`${d.data.value}`)
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px");
          })
          .on("mouseout", () => {
            d3.select("#tooltip").style("display", "none");
          });

        container
          .append("text")
          .attr("transform", (d) => `translate(${arc.centroid(d)})`)
          .attr("dy", "-0.5em")
          .attr("text-anchor", "middle")
          .style("fill", "white")
          .style("font-weight", "bold")
          .style("font-size", 12)
          .text((d) => d.data.name);
        container
          .append("text")
          .attr("transform", (d) => `translate(${arc.centroid(d)})`)
          .attr("dy", "1em")
          .attr("text-anchor", "middle")
          .style("fill", "white")
          .style("font-weight", "bold")
          .style("font-size", 20)
          .text((d) => `${((d.data.value / total) * 100).toFixed(1)}%`);
      });
  }, [data]);

  return (
    <div className="w-fit">
      <h2 className="text-xl font-bold text-white">Total appointements</h2>
      <div className="appointementTotalChart">
        <svg ref={svgRef} width="300" height="300" />
      </div>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          display: "none",
          backgroundColor: "lightgrey",
          padding: "5px",
          borderRadius: "5px",
          fontWeight: "bold",
          color: "black",
        }}
      ></div>
    </div>
  );
}
export default AppointementTotalChart;
