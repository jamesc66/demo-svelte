<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import Legend from "./Legend.svelte";
  import Toggles from "./Toggles.svelte";

  let svgElement;

  export let data: any[] = [];
  export let config = {};

  // Define the series variable
  let series = Array.from(new Set(data.map((d) => d[config.seriesKey])));

  $: margin = config.margin;
  $: width = config.width - margin.left - margin.right;
  $: height = config.height - margin.top - margin.bottom;

  let show = {
    grid: config.defaultFeatures
      ? config.defaultFeatures.includes("grid")
      : config.show.includes("grid"),
    axis: config.defaultFeatures
      ? config.defaultFeatures.includes("axis")
      : config.show.includes("axis"),
    areas: config.defaultFeatures
      ? config.defaultFeatures.includes("areas")
      : config.show.includes("areas"),
    lines: config.defaultFeatures
      ? config.defaultFeatures.includes("lines")
      : config.show.includes("lines"),
    points: config.defaultFeatures
      ? config.defaultFeatures.includes("points")
      : config.show.includes("points"),
    legend: config.defaultFeatures
      ? config.defaultFeatures.includes("legend")
      : config.show.includes("legend"),
    tooltip: config.defaultFeatures
      ? config.defaultFeatures.includes("tooltip")
      : config.show.includes("tooltip"),
    heat: config.defaultFeatures
      ? config.defaultFeatures.includes("heat")
      : config.show.includes("heat"),
  };

  $: console.log(data);

  let selectedSeries = new Set(data.map((d) => d.location));
  const color = d3.scaleOrdinal(config.colors);
  // const color = d3.scaleOrdinal(d3.schemeCategory10);
  let seriesColorMap = new Map();
  series.forEach((s, i) => {
    seriesColorMap.set(s, color(i));
  });

  function parseDate(dateStr) {
    return d3.isoParse(dateStr);
  }

  function createSvg(svgElement, width, height, margin) {
    const svg = d3
      .select(svgElement)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the clipping path
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    return svg;
  }

  function createScales(data, width, height) {
    const allValues = data.flatMap((series) => series.values);

    const x = d3
      .scaleTime()
      .domain(d3.extent(allValues, (d) => parseDate(d.date)))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allValues, (d) => d.value)])
      .range([height, 0]);

    return { x, y };
  }

  function addGridLines(svg, x, y, width, height) {
    svg
      .append("g")
      .attr("class", "grid x-grid")
      .attr("color", "lightgray")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3.axisBottom(x).ticks(config.ticks).tickSize(-height).tickFormat("")
      );

    svg
      .append("g")
      .attr("color", "lightgray")
      .attr("class", "grid y-grid")
      .call(d3.axisLeft(y).ticks(config.ticks).tickSize(-width).tickFormat(""));
  }

  function addAxes(svg, x, y, height) {
    const xAxis = svg
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${height})`)
      // .call(d3.axisBottom(x).ticks(config.ticks).tickFormat(d3.timeFormat("%b")));
      // .call(d3.axisBottom(x).ticks(config.ticks).tickFormat(d3.timeFormat("%d/%m/%Y")));
      .call(
        d3
          .axisBottom(x)
          .ticks(config.ticks)
          .tickFormat(d3.timeFormat("%d/%m/%Y"))
      );

    const yAxis = svg
      .append("g")
      .attr("class", "axis y-axis")
      .call(d3.axisLeft(y));

    // Set the color of the axis lines to blue
    xAxis.selectAll("path").attr("stroke", "#4083b9");
    xAxis.selectAll("line").attr("stroke", "#4083b9");
    yAxis.selectAll("path").attr("stroke", "#4083b9");
    yAxis.selectAll("line").attr("stroke", "#4083b9");

    // Set the color of the axis text to black
    xAxis.selectAll("text").attr("fill", "#000000");
    yAxis.selectAll("text").attr("fill", "#000000");
  }

  function addAreas(svg, data, x, y, config) {
    data.forEach((series, index) => {
      if (selectedSeries.has(series.location)) {
        const area = d3
          .area()
          .x((d) => x(parseDate(d.date)))
          .y0(y(0))
          .y1((d) => y(d.value));

        svg
          .append("path")
          .datum(series.values)
          .attr("class", `area series-${index}`)
          .attr("fill", color(index))
          .attr("opacity", config.areaOpacity || 0.3)
          .attr("d", area);
      }
    });
  }

  function addLines(svg, data, x, y, config) {
    data.forEach((series, index) => {
      if (selectedSeries.has(series.location)) {
        const line = d3
          .line()
          .x((d) => x(parseDate(d.date)))
          .y((d) => y(d.value));

        svg
          .append("path")
          .datum(series.values)
          .attr("class", `line series-${index}`)
          .attr("fill", "none")
          .attr("stroke", color(index))
          .attr("stroke-width", config.lineWidth || 1.5)
          .attr("d", line);
      }
    });
  }

  function addPoints(svg, data, x, y, config) {
    data.forEach((series, index) => {
      if (selectedSeries.has(series.location)) {
        svg
          .selectAll(`circle.series-${index}`)
          .data(series.values)
          .enter()
          .append("circle")
          .attr("class", `point series-${index}`)
          .attr("cx", (d) => x(parseDate(d.date)))
          .attr("cy", (d) => y(d.value))
          .attr("r", config.pointRadius || 2)
          .attr("fill", color(index));
      }
    });
  }

  function addLegend(svg, data, width, margin, config) {
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 10}, 20)`);

    data.forEach((series, index) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${index * 20})`);

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr(
          "fill",
          selectedSeries.has(series.location) ? color(index) : "white"
        )
        .style("stroke", color(index))
        .style("stroke-width", 2)
        .style("cursor", "pointer")
        .on("click", function () {
          toggleSeries(series.location);
        });

      legendRow
        .append("text")
        .attr("x", 15)
        .attr("y", 10)
        .style("font-size", "10px")
        .attr("text-anchor", "start")
        .style("text-transform", "capitalize")
        .text(series.location);
    });
  }

  function addTooltip() {
    d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  function drawToggles(svg, width, height, config) {
    const toggles = svg
      .append("g")
      .attr("class", "toggles")
      .attr("transform", `translate(${width + 80}, 20)`);

    const toggleData = Object.keys(show);

    toggles
      .selectAll("circle")
      .data(toggleData)
      .enter()
      .append("circle")
      .attr("cx", 15)
      .attr("cy", (d, i) => 15 + i * 20)
      .attr("r", 5)
      .style("fill", (d) => (show[d] ? "blue" : "white"))
      .style("stroke", "black")
      .style("stroke-width", 1)
      .on("click", function (event, d) {
        show[d] = !show[d];
        startGraph();
      });

    toggles
      .selectAll("text")
      .data(toggleData)
      .enter()
      .append("text")
      .attr("x", 30)
      .attr("y", (d, i) => 20 + i * 20)
      .style("font-size", "10px")
      .attr("alignment-baseline", "middle")
      .text((d) => d);
  }

  function startGraph() {
    // Remove any previous content inside the SVG to avoid overlapping
    d3.select(svgElement).selectAll("*").remove();

    const svg = createSvg(svgElement, width, height, margin);
    const { x, y } = createScales(data, width, height);

    // Add zoom functionality
    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const newX = event.transform.rescaleX(x);
        const newY = event.transform.rescaleY(y);

        svg.selectAll(".grid").remove();
        svg.selectAll(".axis").remove();
        svg.selectAll(".area").remove();
        svg.selectAll(".line").remove();
        svg.selectAll(".point").remove();

        if (show.grid) addGridLines(svg, newX, newY, width, height);
        if (show.axis) addAxes(svg, newX, newY, height);

        // Clip the graph within the defined area
        const graphGroup = svg.append("g").attr("clip-path", "url(#clip)");

        if (show.areas) addAreas(graphGroup, data, newX, newY, config);
        if (show.lines) addLines(graphGroup, data, newX, newY, config);
        if (show.points) addPoints(graphGroup, data, newX, newY, config);
      });

    d3.select(svgElement).call(zoom);

    d3.select(svgElement).on("contextmenu", (event) => {
      event.preventDefault();
      d3.select(svgElement)
        .transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    });

    if (show.grid) addGridLines(svg, x, y, width, height);
    if (show.axis) addAxes(svg, x, y, height);

    // Clip the graph within the defined area
    const graphGroup = svg.append("g").attr("clip-path", "url(#clip)");

    if (show.areas) addAreas(graphGroup, data, x, y, config);
    if (show.lines) addLines(graphGroup, data, x, y, config);
    if (show.points) addPoints(graphGroup, data, x, y, config);
  }

  onMount(() => {
    startGraph();
  });

  $: if (data.length) {
    startGraph();
  }

  function toggleShow(option) {
    show[option] = !show[option];
    startGraph();
  }

  function toggleSeries(seriesKey) {
    console.log("toggleSeries", seriesKey);
    if (selectedSeries.has(seriesKey)) {
      selectedSeries.delete(seriesKey);
    } else {
      selectedSeries.add(seriesKey);
    }
    startGraph();
  }
</script>

<div class="container">
  <svg bind:this={svgElement}></svg>

  <div class="controls">
    <Legend {series} {selectedSeries} {seriesColorMap} {toggleSeries} />
    <Toggles {show} {toggleShow} />
  </div>
</div>

<style>
  .toggles {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-right: 20px;
  }
  .toggles div {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .tooltip {
    position: absolute;
    text-align: center;
    padding: 5px;
    font: 12px sans-serif;
    background: lightsteelblue;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
  }
  .container {
    display: flex;
    justify-content: space-between;
  }
</style>
