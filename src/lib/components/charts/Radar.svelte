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
    type RadarConfig,
  } from "./splitRadar";

  export let config: RadarConfig;
  export let data: any[] = [{ room: "", insight: "", value: 0 }];
  export let allData: any[] = [];

  let show = initializeShow({ config });
  let nestedData: Map<any, Record<string, any>[]>;
  let nestedAllData: Map<any, Record<string, any>[]>;
  let color = d3.scaleOrdinal(config.colors);
  let selectedSeries = new Set(data.map((d) => d[config.seriesKey]));
  let seriesColorMap = new Map<string, string>();
  let series = Array.from(new Set(data.map((d) => d[config.seriesKey])));

  onMount(() => {
    nestedData = d3.group(data, (d) => d[config.nKey]);
    nestedAllData = d3.group(allData, (d) => d[config.nKey]);
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
      allData: nestedAllData,
    });
  });

  $: {
    nestedData = d3.group(data, (d) => d[config.nKey]);
    nestedAllData = d3.group(allData, (d) => d[config.nKey]);
    series = Array.from(new Set(data.map((d) => d[config.seriesKey])));
    drawChart({
      data: nestedData,
      initialLoad: false,
      show,
      selectedSeries,
      seriesColorMap,
      config,
      allData: nestedAllData,
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
    data: Map<any, Record<string, any>[]>;
    initialLoad: boolean;
    show: { [key: string]: boolean };
    selectedSeries: Set<string>;
    seriesColorMap: Map<string, string>;
    config: RadarConfig;
    allData: Map<any, Record<string, any>[]>;
  }) {
    const margin = config.margin;
    const width = config.width - margin.left - margin.right;
    const height = config.height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = initializeSVG({
      margin,
      width,
      height,
    }) as unknown as d3.Selection<SVGGElement, unknown, null, undefined>;
    const angleSlice = calculateAngleSlice({ data });
    const rScale = initializeScale({ radius });

    const filteredData = new Map(
      Array.from(data.entries()).filter(([key]) => selectedSeries.has(key))
    );

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
      radius,
      shadedSegments: config.shadedSegments, // Ensure shadedSegments is included
    });

    const legendContainer = d3.select("#legend") as d3.Selection<
      HTMLDivElement,
      unknown,
      HTMLElement,
      any
    >;
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
      allData: nestedAllData,
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
      allData: nestedAllData,
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
