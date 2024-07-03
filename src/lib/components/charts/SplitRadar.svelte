<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import Legend from "./Legend.svelte";
  import Toggles from "./Toggles.svelte";
  import TimelineVanilla from "./TimelineVanilla.svelte";
  import {
    initializeSeriesColors,
    drawHeatPoint,
    initializeSVG,
    calculateAngleSlice,
    initializeScale,
    drawGrid,
    drawAxis,
    drawRadarAreas,
    drawRadarLines,
    drawRadarPoints,
    shadeSegments,
    addTooltip,
    drawToggles,
    drawLegend,
    addAnnotations,
    initializeShow,
  } from "./splitRadar";

  export let config;
  export let data: any[] = [{ room: "", insight: "", value: 0 }];
  export let allData: any[] = [];

  let show = initializeShow(config);

  let nestedData;
  let color = d3.scaleOrdinal(config.colors);
  let selectedSeries = new Set(data.map((d) => d[config.seriesKey]));
  let seriesColorMap = new Map();

  // Define the series variable
  let series = Array.from(new Set(data.map((d) => d[config.seriesKey])));

  onMount(() => {
    nestedData = d3.group(data, (d) => d[config.nKey]);
    initializeSeriesColors(
      data,
      config.seriesKey,
      seriesColorMap,
      config.colors
    );

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
    series = Array.from(new Set(data.map((d) => d[config.seriesKey])));
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
    const margin = config.margin;
    const width = config.width - margin.left - margin.right;
    const height = config.height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = initializeSVG(margin, width, height);
    const angleSlice = calculateAngleSlice(data);
    const rScale = initializeScale(radius);

    const filteredData = Array.from(data.entries())
      .filter(([key, values]) => selectedSeries.has(key))
      .reduce((acc, [key, values]) => acc.set(key, values), new Map());

    const shadedSegments = [
      {
        startAxis: 2.5,
        endAxis: 3.5,
        color: "white",
        opacity: 1,
      },
      {
        startAxis: 5.5,
        endAxis: 6.5,
        color: "white",
        opacity: 1,
      },
    ];

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

    if (show.shadedSegments)
      shadeSegments(svg, rScale, angleSlice, config, shadedSegments);

    if (show.grid) drawGrid(svg, radius);
    if (show.axis) drawAxis(svg, filteredData, rScale, angleSlice, config);
    if (show.legend) drawLegend();
    if (show.tooltip) addTooltip();
    if (config.togle) drawToggles();
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

    if (show.annotations) addAnnotations(svg, radius);
  }

  function toggleSeries(d: any) {
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
    );
  }

  function toggleShow(option: string) {
    show[option] = !show[option];
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
</script>

<div class="container">
  <div>
    <div id="radarChart"></div>
    <TimelineVanilla data={allData} on:dateSelected />
  </div>

  <div class="controls">
    <Legend {series} {selectedSeries} {seriesColorMap} {toggleSeries} />
    <Toggles {show} {toggleShow} />
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
  }
</style>
