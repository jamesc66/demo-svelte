<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import {
    initializeSVG,
    calculateAngleSlice,
    initializeScale,
    drawGrid,
    drawAxis,
    drawRadarAreas,
    drawRadarLines,
    drawHeatPoint,
    drawRadarPoints,
    initializeSeriesColors,
  } from "./components";

  export let config;
  export let data: any[] = [{ room: "", insight: "", value: 0 }];
  export let allData: any[] = [];

  let show = {
    grid: config.show.includes("grid"),
    axis: config.show.includes("axis"),
    areas: config.show.includes("areas"),
    lines: config.show.includes("lines"),
    points: config.show.includes("points"),
    legend: config.show.includes("legend"),
    tooltip: config.show.includes("tooltip"),
    heat: config.show.includes("heat"),
  };

  let nestedData;
  let color = d3.scaleOrdinal(d3.schemeCategory10);
  let selectedSeries = new Set(data.map((d) => d[config.seriesKey]));
  let seriesColorMap = new Map();

  onMount(() => {
    nestedData = d3.group(data, (d) => d[config.nKey]);
    initializeSeriesColors(data, config.seriesKey, seriesColorMap);

    drawChart(
      nestedData,
      true,
      show,
      selectedSeries,
      seriesColorMap,
      config,
      allData
    );
  });

  $: {
    nestedData = d3.group(data, (d) => d[config.nKey]);
    drawChart(
      nestedData,
      false,
      show,
      selectedSeries,
      seriesColorMap,
      config,
      allData
    );
  }

  function drawChart(
    data,
    initialLoad,
    show,
    selectedSeries,
    seriesColorMap,
    config,
    allData
  ) {
    const margin = { top: 50, right: 150, bottom: 50, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = initializeSVG(margin, width, height);
    const angleSlice = calculateAngleSlice(data);
    const rScale = initializeScale(radius);

    const filteredData = Array.from(data.entries())
      .filter(([key, values]) => selectedSeries.has(key))
      .reduce((acc, [key, values]) => acc.set(key, values), new Map());

    if (show.grid) drawGrid(svg, radius);
    if (show.axis) drawAxis(svg, filteredData, rScale, angleSlice, config);
    if (show.areas)
      drawRadarAreas(
        svg,
        filteredData,
        rScale,
        angleSlice,
        initialLoad,
        seriesColorMap,
        config
      );
    if (show.lines)
      drawRadarLines(
        svg,
        filteredData,
        rScale,
        angleSlice,
        initialLoad,
        seriesColorMap,
        config
      );
    if (show.heat)
      drawHeatPoint(
        svg,
        allData,
        rScale,
        angleSlice,
        config,
        color,
        selectedSeries
      );
    if (show.points)
      drawRadarPoints(
        svg,
        filteredData,
        rScale,
        angleSlice,
        initialLoad,
        seriesColorMap,
        show,
        config
      );
    if (show.legend)
      drawLegend(
        svg,
        data,
        width,
        height,
        seriesColorMap,
        selectedSeries,
        config
      );
    if (show.tooltip) addTooltip();
    if (config.togle) drawToggles(svg, data, width, height, config);
  }
  export function drawLegend(
    svg,
    data,
    width,
    height,
    seriesColorMap,
    selectedSeries,
    config
  ) {
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width / 2 + 20}, ${-height / 2})`);

    legend
      .selectAll("rect")
      .data(Array.from(data.keys()))
      .enter()
      .append("rect")
      .attr("x", 10)
      .attr("y", (d, i) => 10 + i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", (d) =>
        selectedSeries.has(d) ? seriesColorMap.get(d) : "white"
      )
      .style("stroke", "black")
      .on("click", function (event, d) {
        if (selectedSeries.has(d)) {
          selectedSeries.delete(d);
        } else {
          selectedSeries.add(d);
        }
        drawChart(
          nestedData,
          false,
          show,
          selectedSeries,
          seriesColorMap,
          config,
          allData
        ); // Redraw the chart with the updated room selection
      });

    legend
      .selectAll("text")
      .data(Array.from(data.keys()))
      .enter()
      .append("text")
      .attr("x", 30)
      .attr("y", (d, i) => 20 + i * 20)
      .style("font-size", "10px")
      .attr("alignment-baseline", "middle")
      .text((d) => d);
  }

  export function addTooltip() {
    d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  function drawToggles(svg, data, width, height, config) {
    const toggles = svg
      .append("g")
      .attr("class", "toggles")
      .attr("transform", `translate(${width / 2 + 20 + 80}, ${-height / 2})`);

    const toggleData = Object.keys(show);

    toggles
      .selectAll("circle")
      .data(toggleData)
      .enter()
      .append("circle")
      .attr("cx", 15) // x coordinate for the center of the circle
      .attr("cy", (d, i) => 15 + i * 20) // y coordinate for the center of the circle
      .attr("r", 5) // radius of the circle
      .style("fill", (d) => (show[d] ? "blue" : "white")) // fill color of the circle based on show status
      .style("stroke", "black") // outline color of the circle
      .style("stroke-width", 1) // width of the outline
      .on("click", function (event, d) {
        show[d] = !show[d];
        drawChart(nestedData); // Redraw the chart with the updated show status
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
</script>

<div id="radarChart"></div>
