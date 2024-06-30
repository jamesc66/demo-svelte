<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // Data for the chart
  export let data = [];

  export let color = "red";
  export let id = "chart-trend-";

  export let width = 200;
  export let height = 100;

  onMount(() => {
    const margin = { top: 20, right: 10, bottom: 30, left: 10 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    // Parse the date / time
    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

    // Set the ranges
    const x = d3.scaleTime().range([0, graphWidth]);
    const y = d3.scaleLinear().range([graphHeight, 0]);

    // Define the line
    const valueline = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    // Append the svg object to the body of the component
    const svg = d3
      .select("#" + id)
      .append("svg")
      .attr("width", graphWidth + margin.left + margin.right)
      .attr("height", graphHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Format the data
    data.forEach((d) => {
      d.date = parseTime(d.date);
      d.value = +d.value;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, (d) => d.date));
    y.domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)]);

    // Add the valueline path.
    svg
      .append("path")
      .data([data])
      .attr("d", valueline)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", "2px");

    // Add the X Axis without any ticks
    svg
      .append("g")
      .attr("transform", "translate(0," + graphHeight + ")")
      .call(d3.axisBottom(x).tickSize(0).tickFormat(""));

    // Calculate number of months
    const numberOfMonths = new Set(data.map((d) => d.date.getMonth())).size;

    // Label for the X axis
    // Label for the X axis
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          graphWidth / 2 +
          " ," +
          (graphHeight + margin.top + -0) +
          ")"
      ) // Reduced the vertical offset
      .attr("font-size", "0.7em")
      .style("text-anchor", "middle")
      .text(numberOfMonths + " Months");
  });
</script>

<div {id}></div>
