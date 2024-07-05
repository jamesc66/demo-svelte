<script lang="ts">
  import { onMount } from "svelte";
  import {
    createSvg,
    initializeShow,
    useScales,
    useColors,
    useZoom,
    initializeXYElements,
    type XYConfig,
  } from "./xy";
  import * as d3 from "d3";
  import Legend from "./Legend.svelte";
  import Toggles from "./Toggles.svelte";

  let svgElement: SVGSVGElement;
  export let data: any[] = [];
  export let config: XYConfig;

  let series = Array.from(new Set(data.map((d) => d[config.nKey])));
  let show = initializeShow({ defaultFeatures: config.defaultFeatures });
  let selectedSeries = new Set(data.map((d) => d[config.nKey]));

  const { color } = useColors({
    colors: config.colors,
    series,
  });

  function startGraph(): void {
    const margin = config.margin;
    const width = config.width - margin.left - margin.right;
    const height = config.height - margin.top - margin.bottom;

    d3.select(svgElement).selectAll("*").remove();

    const svg = createSvg(svgElement, width, height, margin);
    const { x, y } = useScales({
      data,
      width,
      height,
      xKey: config.xKey,
      yKey: config.yKey,
      dKey: config.dKey,
    });
    const graphGroup = svg.append("g").attr("clip-path", "url(#clip)");

    useZoom({
      svgElement,
      x,
      y,
      width,
      height,
      show,
      data,
      color,
      selectedSeries,
      ticks: config.ticks,
      lineWidth: config.lineWidth,
      pointWidth: config.pointWidth,
      nKey: config.nKey,
      xKey: config.xKey,
      yKey: config.yKey,
      dKey: config.dKey,
    });

    initializeXYElements({
      svg,
      graphGroup,
      data,
      x,
      y,
      color,
      selectedSeries,
      show,
      width,
      height,
      ticks: config.ticks,
      lineWidth: config.lineWidth,
      pointWidth: config.pointWidth,
      nKey: config.nKey,
      xKey: config.xKey,
      yKey: config.yKey,
      dKey: config.dKey,
    });
  }

  function toggleShow(option: string): void {
    show[option] = !show[option];
    startGraph();
  }

  function toggleSeries(nKey: string): void {
    if (selectedSeries.has(nKey)) {
      selectedSeries.delete(nKey);
    } else {
      selectedSeries.add(nKey);
    }
    startGraph();
  }

  onMount((): void => {
    startGraph();
  });

  $: if (data.length) {
    startGraph();
  }
</script>

<div class="container">
  <svg bind:this={svgElement}></svg>
  <div class="controls">
    <Legend {series} {selectedSeries} {color} {toggleSeries} />
    <Toggles {show} {toggleShow} />
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
  }
</style>
