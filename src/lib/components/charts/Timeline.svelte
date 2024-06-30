<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import * as d3 from "d3";

  export let data: {
    date: string;
    insight: { room: string; insight: string; value: number }[];
  }[];

  const dispatch = createEventDispatcher();

  onMount(() => {
    drawTimeline(data);
  });

  function drawTimeline(data) {
    const margin = { top: 10, right: 20, bottom: 20, left: 20 };
    const width = 400 - margin.left - margin.right;
    const height = 70 - margin.top - margin.bottom;
    const cursorWidth = 2;

    const svg = d3
      .select("#timeline")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)))
      .range([0, width]);

    const xAxis = d3
      .axisBottom(x)
      .ticks(data.length)
      .tickFormat(d3.timeFormat("%Y-%m-%d"));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - 10})`)
      .call(xAxis);

    const clickableArea = svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .attr("pointer-events", "all");

    const slider = svg
      .append("g")
      .attr("class", "slider")
      .attr("transform", `translate(0,${height / 2})`);

    const handle = slider
      .append("rect")
      .attr("class", "handle")
      .attr("width", cursorWidth)
      .attr("height", height - 20)
      .attr("x", x(new Date(data[0].date)) - 4)
      .attr("y", -height / 2 + 10);

    const ghostHandle = slider
      .append("rect")
      .attr("class", "ghost-handle")
      .attr("width", cursorWidth)
      .attr("height", height - 20)
      .attr("x", x(new Date(data[0].date)) - 4)
      .attr("y", -height / 2 + 10)
      .attr("fill", "lightsteelblue")
      .attr("opacity", 0);

    clickableArea
      .on("mousemove", function (event) {
        const xPos = d3.pointer(event, this)[0];
        ghostHandle.attr("x", xPos - 4).attr("opacity", 0.5);
      })
      .on("mouseout", function () {
        ghostHandle.attr("opacity", 0);
      })
      .on("mousedown", function (event) {
        const xPos = d3.pointer(event, this)[0];
        handle.attr("x", xPos - 4);

        const date = x.invert(xPos);
        const closestDate = data.reduce((prev, curr) => {
          return Math.abs(new Date(curr.date).getTime() - date.getTime()) <
            Math.abs(new Date(prev.date).getTime() - date.getTime())
            ? curr
            : prev;
        }).date;

        handle.attr("x", x(new Date(closestDate)) - 4);

        dispatch("dateSelected", closestDate);
      });

    const drag = d3
      .drag()
      .on("start", function (event) {
        const xPos = event.x;
        handle.attr("x", xPos - 4);

        const date = x.invert(xPos);
        const closestDate = data.reduce((prev, curr) => {
          return Math.abs(new Date(curr.date).getTime() - date.getTime()) <
            Math.abs(new Date(prev.date).getTime() - date.getTime())
            ? curr
            : prev;
        }).date;

        handle.attr("x", x(new Date(closestDate)) - 4);
        dispatch("dateSelected", closestDate);
      })
      .on("drag", function (event) {
        let xPos = event.x;
        if (xPos < 0) xPos = 0;
        if (xPos > width) xPos = width;

        handle.attr("x", xPos - 4);

        const date = x.invert(xPos);
        const closestDate = data.reduce((prev, curr) => {
          return Math.abs(new Date(curr.date).getTime() - date.getTime()) <
            Math.abs(new Date(prev.date).getTime() - date.getTime())
            ? curr
            : prev;
        }).date;

        dispatch("dateSelected", closestDate);
      })
      .on("end", function (event) {
        let xPos = event.x;
        if (xPos < 0) xPos = 0;
        if (xPos > width) xPos = width;

        const date = x.invert(xPos);
        const closestDate = data.reduce((prev, curr) => {
          return Math.abs(new Date(curr.date).getTime() - date.getTime()) <
            Math.abs(new Date(prev.date).getTime() - date.getTime())
            ? curr
            : prev;
        }).date;

        handle.attr("x", x(new Date(closestDate)) - 4);

        dispatch("dateSelected", closestDate);
      });

    handle.call(drag);
    clickableArea.call(drag);
  }
  let play = false;

  const togglePlay = () => {
    play = !play;
  };

  const handlePlay = () => {};
  const handlePause = () => {};

  $: if (play) {
    handlePlay();
  } else {
    handlePause();
  }
</script>

<div id="timeline" on:mouseleave={() => ghostHandle.attr("opacity", 0)}></div>

<style>
  .handle {
    fill: steelblue;
    cursor: pointer;
  }

  .ghost-handle {
    fill: lightsteelblue;
    cursor: pointer;
    opacity: 0.5;
  }

  .axis path,
  .axis line {
    fill: none;
    shape-rendering: crispEdges;
  }

  .axis text {
    font-size: 10px;
    font-family: sans-serif;
  }

  .slider .handle {
    stroke: #000;
    stroke-width: 1;
  }
</style>
