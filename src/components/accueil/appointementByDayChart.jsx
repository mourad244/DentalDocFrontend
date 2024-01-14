import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function AppointementChartByDays() {
  // i want to create a chart with the number of appointements scheduled, canceled and missed,
  // each bar will be a day of the month, and the height of the bar will be the number of appointements
  // scheduled, canceled or missed for that day

  const data = [
    { day: 1, scheduled: 5, canceled: 2, missed: 1 },
    { day: 2, scheduled: 3, canceled: 1, missed: 0 },
    { day: 3, scheduled: 4, canceled: 2, missed: 1 },
    { day: 4, scheduled: 2, canceled: 0, missed: 0 },
    { day: 5, scheduled: 5, canceled: 2, missed: 1 },
    { day: 6, scheduled: 3, canceled: 1, missed: 0 },
    { day: 7, scheduled: 4, canceled: 2, missed: 1 },
    { day: 8, scheduled: 2, canceled: 0, missed: 0 },
    { day: 9, scheduled: 5, canceled: 2, missed: 1 },
    { day: 10, scheduled: 3, canceled: 1, missed: 0 },
    { day: 11, scheduled: 4, canceled: 2, missed: 1 },
    { day: 12, scheduled: 2, canceled: 0, missed: 0 },
    { day: 13, scheduled: 5, canceled: 2, missed: 1 },
    { day: 14, scheduled: 3, canceled: 1, missed: 0 },
    { day: 15, scheduled: 4, canceled: 2, missed: 1 },
    { day: 16, scheduled: 2, canceled: 0, missed: 0 },
    { day: 17, scheduled: 5, canceled: 2, missed: 1 },
    { day: 18, scheduled: 3, canceled: 1, missed: 0 },
    { day: 19, scheduled: 4, canceled: 2, missed: 1 },
    { day: 20, scheduled: 2, canceled: 0, missed: 0 },
    { day: 21, scheduled: 5, canceled: 2, missed: 1 },
    { day: 22, scheduled: 3, canceled: 1, missed: 0 },
    { day: 23, scheduled: 4, canceled: 2, missed: 1 },
    { day: 24, scheduled: 2, canceled: 0, missed: 0 },
    { day: 25, scheduled: 5, canceled: 2, missed: 1 },
    { day: 26, scheduled: 3, canceled: 1, missed: 0 },
    { day: 27, scheduled: 4, canceled: 2, missed: 1 },
    { day: 28, scheduled: 2, canceled: 0, missed: 0 },
    { day: 29, scheduled: 5, canceled: 2, missed: 1 },
    { day: 30, scheduled: 3, canceled: 1, missed: 0 },
    { day: 31, scheduled: 4, canceled: 2, missed: 1 },
  ];
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svgRef = useRef();
  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    const x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(data.map((d) => d.day));

    const y = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(data, (d) => d.scheduled)]);

    const color = d3
      .scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888"])
      .domain(["scheduled", "canceled", "missed"]);

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(10, "%"))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of appointments");

    // Add bars
    const day = svg
      .selectAll(".day")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "day")
      .attr("transform", (d) => `translate(${x(d.day)}, 0)`);

    day
      .selectAll("rect")
      .data((d) => [
        { category: "scheduled", value: d.scheduled },
        { category: "canceled", value: d.canceled },
        { category: "missed", value: d.missed },
      ])
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))
      .style("fill", (d) => color(d.category));

    // Add legend
    const legend = svg
      .selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d);
  }, [data]);

  return (
    <div>
      <h2 className="text-xl font-bold">Appointement Chart</h2>
      <div id="appointementChart">
        <svg ref={svgRef} />{" "}
      </div>
    </div>
  );
}
export default AppointementChartByDays;
