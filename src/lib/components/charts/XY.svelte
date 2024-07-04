<script lang="ts">
  import { onMount } from "svelte";
  import {
    createSvg,
    initializeShow,
    useScales,
    useColors,
    useZoom,
    initializeXYElements,
  } from "./xy";
  import * as d3 from "d3";
  import Legend from "./Legend.svelte";
  import Toggles from "./Toggles.svelte";

  let svgElement;
  export let data: any[] = [];
  export let config: any = {};

  let series = Array.from(new Set(data.map((d) => d[config.seriesKey])));
  let show = initializeShow({ defaultFeatures: config.defaultFeatures });
  let selectedSeries = new Set(data.map((d) => d.location));

  const { color, seriesColorMap } = useColors({
    colors: config.colors,
    series,
  });

  function startGraph() {
    const margin = config.margin;
    const width = config.width - margin.left - margin.right;
    const height = config.height - margin.top - margin.bottom;

    d3.select(svgElement).selectAll("*").remove();

    const svg = createSvg(svgElement, width, height, margin);
    const { x, y } = useScales(data, width, height);
    const graphGroup = svg.append("g").attr("clip-path", "url(#clip)");

    useZoom({
      svgElement,
      x,
      y,
      width,
      height,
      config,
      show,
      data,
      color,
      selectedSeries,
      ticks: config.ticks,
      lineWidth: config.lineWidth,
      pointWidth: config.pointWidth,
      seriesKey: config.seriesKey,
    });

    initializeXYElements({
      svg,
      graphGroup,
      data,
      x,
      y,
      config,
      color,
      selectedSeries,
      show,
      width,
      height,
      ticks: config.ticks,
      lineWidth: config.lineWidth,
      pointWidth: config.pointWidth,
      seriesKey: config.seriesKey,
      config,
    });
  }

  function toggleShow(option: string) {
    show[option] = !show[option];
    startGraph();
  }

  function toggleSeries(seriesKey: string) {
    if (selectedSeries.has(seriesKey)) {
      selectedSeries.delete(seriesKey);
    } else {
      selectedSeries.add(seriesKey);
    }
    startGraph();
  }

  onMount(() => {
    startGraph();
  });

  $: if (data.length) {
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
  .container {
    display: flex;
    justify-content: space-between;
  }
</style>
