import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function AppointementTotalChart({ data }) {
  // const data = [
  //   { name: "Programmé", number: 2 },
  //   { name: "Annulé", number: 50 },
  //   { name: "Sans RDV", number: 5 },
  //   { name: "Manqué", number: 20 },
  //   { name: "Reporté", number: 2 },
  // ];
  const total = data.reduce((sum, entry) => sum + entry.number, 0);

  const svgRef = useRef();
  useEffect(() => {
    const margin = { top: 0, right: 100, bottom: 0, left: 0 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    d3.select(svgRef.current).selectAll("*").remove();

    const radius = Math.min(width, height) / 2;

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.number);

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 1);

    const arcs = pie(data);
    if (total === 0) {
      // Render "No Data" text if total is zero
      d3.select(svgRef.current)
        .append("text")
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-weight", "bold")
        .style("font-size", "20px")
        .text("No Data");
    } else {
      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

      const defs = svg.append("defs");

      // Define gradients

      const gradients = [
        { id: "gradient1", name: "Programmé" },
        { id: "gradient2", name: "Annulé" },
        { id: "gradient3", start: "#003547", end: "#003144", name: "Sans RDV" },
        { id: "gradient4", start: "#FFB0AB", end: "#F08890", name: "Manqué" },
        { id: "gradient5", start: "#FFF700", end: "#FFD700", name: "Reporté" }, // Yellow gradient
      ];

      gradients.forEach((grad) => {
        const linearGradient = defs
          .append("linearGradient")
          .attr("id", grad.id)
          .attr("x1", "0%")
          .attr("x2", "100%")
          .attr("y1", "0%")
          .attr("y2", "100%");
        linearGradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", grad.start);
        linearGradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", grad.end);
      });
      // Create the pie chart segments
      const segments = svg
        .selectAll(".arc")
        .data(arcs)
        .join("g")
        .attr("class", "arc");

      segments
        .append("path")
        .attr("fill", (d, i) => `url(#gradient${i + 1})`)
        .attr("d", arc)
        .attr("data-name", (d) => d.data.name)
        .on("mouseover", function (event, d) {
          d3.select(this).style("opacity", 0.5);
          const tooltip = d3.select("#tooltip");
          tooltip
            .style("display", "block")
            .text(`${d.data.number}`)
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY}px`);
        })
        .on("mouseout", function () {
          d3.select(this).style("opacity", 1);
          d3.select("#tooltip").style("display", "none");
        });
      // segments.each(function (d) {
      //   if (d.data.number > 0) {
      //     // Calculate midpoint angle
      //     const angle = (d.startAngle + d.endAngle) / 2;

      //     // Generate a random radial offset within a range
      //     const minOffset = radius / 25;
      //     // Minimum offset
      //     const maxOffset = radius / 3; // Maximum offset
      //     const randomOffset =
      //       Math.random() * (maxOffset - minOffset) + minOffset;

      //     // Calculate text position
      //     const x = (radius - randomOffset) * Math.sin(angle);
      //     const y = -(radius - randomOffset) * Math.cos(angle);

      //     d3.select(this)
      //       .append("text")
      //       .attr("transform", `translate(${x}, ${y})`)
      //       .attr("text-anchor", "middle")
      //       .style("fill", "black")
      //       .style("font-weight", "bold")
      //       .style("font-size", "12px")
      //       .text(`${((d.data.number / total) * 100).toFixed(1)}%`);
      //   }
      // });
      // Create a separate group for text elements
      const textGroup = svg.append("g").attr("class", "text-group");

      textGroup
        .selectAll("text")
        .data(arcs)
        .join("text")
        .each(function (d) {
          if (d.data.number > 0) {
            const angle = (d.startAngle + d.endAngle) / 2;
            const randomOffset =
              Math.random() * (radius / 2 - radius / 10) + radius / 10;
            const x = (radius - randomOffset) * Math.sin(angle);
            const y = -(radius - randomOffset) * Math.cos(angle);

            d3.select(this)
              .attr("transform", `translate(${x}, ${y})`)
              .attr("text-anchor", "middle")
              .style("fill", "white")
              .style("font-weight", "bold")
              .style("font-size", "12px")
              .text(`${((d.data.number / total) * 100).toFixed(1)}%`);
          }
        });
      // Legend
      const legend = svg
        .append("g")
        .attr("transform", `translate(${-width / 2 - 30},${-height / 2 + 3})`);

      gradients.forEach((grad, index) => {
        const legendItem = legend
          .append("g")
          .attr("transform", `translate(200, ${index * 16})`)
          .style("cursor", "pointer")
          .on("mouseover", () => {
            segments
              .select(`path[data-name="${grad.name}"]`)
              .style("opacity", 0.5);
          })
          .on("mouseout", () => {
            segments
              .select(`path[data-name="${grad.name}"]`)
              .style("opacity", 1);
          });

        legendItem
          .append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", `url(#${grad.id})`);

        legendItem
          .append("text")
          .attr("x", 15)
          .attr("y", 10)
          .text(grad.name)
          .style("font-size", "10px")
          .style("fill", "white");
      });
    }
  }, [data, total]);

  return (
    <div className="w-fit">
      <h2 className="text-sm font-bold text-white">Total des Rendez-vous</h2>
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
          transition: "all 0.3s ease",
          color: "black",
          //
        }}
      />
    </div>
  );
}
export default AppointementTotalChart;
