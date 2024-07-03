<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import Legend from "./Legend.svelte";
  import Toggles from "./Toggles.svelte";
  import {
    createSvg,
    addGridLines,
    addAxes,
    addAreas,
    addLines,
    addPoints,
    initializeShow,
    useScales,
    useColors,
    useZoom,
  } from "./xy";

  let svgElement;
  export let data: any[] = [];
  export let config = {};

  let series = Array.from(new Set(data.map((d) => d[config.seriesKey])));
  let show = initializeShow(config);
  let selectedSeries = new Set(data.map((d) => d.location));

  const { color, seriesColorMap } = useColors(config, series);

  $: margin = config.margin;
  $: width = config.width - margin.left - margin.right;
  $: height = config.height - margin.top - margin.bottom;

  function startGraph() {
    d3.select(svgElement).selectAll("*").remove();

    const svg = createSvg(svgElement, width, height, margin);
    const { x, y } = useScales(data, width, height);
    const graphGroup = svg.append("g").attr("clip-path", "url(#clip)");

    useZoom(
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
      addGridLines,
      addAxes,
      addAreas,
      addLines,
      addPoints
    );

    if (show.grid) addGridLines(svg, x, y, width, height, config);
    if (show.axis) addAxes(svg, x, y, height, config);

    if (show.areas)
      addAreas(graphGroup, data, x, y, config, color, selectedSeries);
    if (show.lines)
      addLines(graphGroup, data, x, y, config, color, selectedSeries);
    if (show.points)
      addPoints(graphGroup, data, x, y, config, color, selectedSeries);
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
