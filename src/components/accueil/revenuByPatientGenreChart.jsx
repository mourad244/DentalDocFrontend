import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function RevenuByPatientGenreChart() {
  // create a cercle chart to visualize paiement revenu by patient genre
  //  genre are "Homme" et "Femme",

  const data = [
    { name: "Homme", value: 8000 },
    { name: "Femme", value: 12000 },
  ];

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const svgRef = useRef();
  useEffect(() => {
    const margin = { top: 0, right: 0, bottom: 0, left: 60 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

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

    const defs = svg.append("defs");

    // Define gradients

    const gradients = [
      { id: "gradient1", name: "Homme" },
      { id: "gradient2", name: "Femme" },
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

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${-width / 2 - 30},${-height / 2 + 5})`);

    gradients.forEach((grad, index) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${index * 20})`);

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
        .style("font-size", "12px")
        .style("fill", "white")
        .style("font-weight", "bold");
    });

    svg
      .selectAll(".arc")
      .data(arcs)
      .join("g")
      .attr("class", "arc")
      .each(function (d, i) {
        const container = d3.select(this);
        container
          .append("path")
          .attr("fill", `url(#gradient${i + 1})`)
          .attr("d", arc)
          .on("mouseover", (event, d) => {
            const tooltip = d3.select("#tooltip");
            tooltip
              .style("display", "block")
              .text(`${d.data.value}`)
              .style("left", event.pageX /*  + 5  */ + "px")
              .style("top", event.pageY /*  + 5  */ + "px");
          })
          .on("mouseout", () => {
            d3.select("#tooltip").style("display", "none");
          });

        // container
        //   .append("text")
        //   .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        //   .attr("dy", "-0.5em")
        //   .attr("text-anchor", "middle")
        //   .style("fill", "white")
        //   .style("font-weight", "bold")
        //   .style("font-size", 10)
        //   .text((d) => );
        container
          .append("text")
          .attr("transform", (d) => `translate(${arc.centroid(d)})`)
          .attr("dy", "1em")
          .attr("text-anchor", "middle")
          .style("fill", "white")
          .style("font-weight", "bold")
          .style("font-size", "12px")
          .text((d) => `${((d.data.value / total) * 100).toFixed(1)}%`);

        // Dashed line from arc to label
        // container
        //   .append("path")
        //   .attr("d", () => {
        //     const posA = arc.centroid(d); // line start
        //     const posB = labelArc.centroid(d); // line end
        //     const mid = [(posA[0] + posB[0]) / 2, (posA[1] + posB[1]) / 2]; // middle
        //     return `M${posA}Q${mid} ${posB}`;
        //   })
        //   .style("fill", "none")
        //   .style("stroke", "white")
        //   .style("stroke-dasharray", "2");
        // make the text appear in top of the arc if the arc is too small
      });
  }, [data]);

  return (
    <div className="w-fit">
      <h2 className="text-center text-sm font-bold text-white">
        Revenu by patient genre
      </h2>
      <div>
        <svg ref={svgRef} width={300} height={300} />
      </div>
    </div>
  );
}

export default RevenuByPatientGenreChart;
