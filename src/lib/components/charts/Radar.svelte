<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import {
    initializeSeriesColors,
    initializeSVG,
    calculateAngleSlice,
    initializeScale,
    initializeShow,
    initializeRadarElements,
    addLegend,
    addToggles,
  } from "./splitRadar";

  export let config;
  export let data: any[] = [{ room: "", insight: "", value: 0 }];
  export let allData: any[] = [];

  let show = initializeShow({ config });
  let nestedData;
  let color = d3.scaleOrdinal(config.colors);
  let selectedSeries = new Set(data.map((d) => d[config.seriesKey]));
  let seriesColorMap = new Map();
  let series = Array.from(new Set(data.map((d) => d[config.seriesKey])));

  onMount(() => {
    nestedData = d3.group(data, (d) => d[config.nKey]);
    initializeSeriesColors({
      data,
      seriesKey: config.seriesKey,
      seriesColorMap,
      customColorScale: config.colors,
    });

    drawChart({
      data: nestedData,
      initialLoad: true,
      show,
      selectedSeries,
      seriesColorMap,
      config,
      allData,
    });
  });

  $: {
    nestedData = d3.group(data, (d) => d[config.nKey]);
    series = Array.from(new Set(data.map((d) => d[config.seriesKey])));
    drawChart({
      data: nestedData,
      initialLoad: false,
      show,
      selectedSeries,
      seriesColorMap,
      config,
      allData,
    });
  }

  function drawChart({
    data,
    initialLoad,
    show,
    selectedSeries,
    seriesColorMap,
    config,
    allData,
  }: {
    data: any;
    initialLoad: boolean;
    show: any;
    selectedSeries: any;
    seriesColorMap: any;
    config: any;
    allData: any;
  }) {
    const margin = config.margin;
    const width = config.width - margin.left - margin.right;
    const height = config.height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = initializeSVG({ margin, width, height });
    const angleSlice = calculateAngleSlice({ data });
    const rScale = initializeScale({ radius });

    const filteredData = Array.from(data.entries())
      .filter(([key]) => selectedSeries.has(key))
      .reduce((acc, [key, values]) => acc.set(key, values), new Map());

    initializeRadarElements({
      svg,
      filteredData,
      rScale,
      angleSlice,
      initialLoad,
      seriesColorMap,
      config,
      show,
      allData,
      shadedSegments: config,
      radius,
    });

    const legendContainer = d3.select("#legend");
    legendContainer.selectAll("*").remove();

    const legendBase = legendContainer
      .append("svg")
      .attr("width", 200)
      .attr("height", series.length * 25 + Object.keys(show).length * 25);

    const legendSvg = legendBase.append("g").attr("class", "legend");

    const togglesSvg = legendSvg
      .append("g")
      .attr("class", "toggles")
      .attr("transform", `translate(0, ${series.length * 25})`);

    addLegend({
      svg: legendSvg,
      data: series.map((key) => ({
        [config.nKey]: key,
      })),
      width: 180,
      color: (key) => seriesColorMap.get(key) || "black",
      selectedSeries,
      toggleSeries,
      nKey: config.nKey,
    });

    addToggles({
      svg: togglesSvg,
      show,
      toggleShow,
    });
  }

  function toggleSeries(d: any) {
    if (selectedSeries.has(d)) {
      selectedSeries.delete(d);
    } else {
      selectedSeries.add(d);
    }
    drawChart({
      data: nestedData,
      initialLoad: false,
      show,
      selectedSeries,
      seriesColorMap,
      config,
      allData,
    });
  }

  function toggleShow(option: string) {
    show[option] = !show[option];
    drawChart({
      data: nestedData,
      initialLoad: false,
      show,
      selectedSeries,
      seriesColorMap,
      config,
      allData,
    });
  }
</script>

<div class="container">
  <div id="radarChart"></div>
  <div id="legend" class="controls"></div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
  }

  #radarChart {
    flex-grow: 1;
  }

  .controls {
    width: 200px;
  }
</style>
