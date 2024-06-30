<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import Legend from "./Legend.svelte";
  import Toggles from "./Toggles.svelte";
  import TimelineVanilla from "./TimelineVanilla.svelte";

  export function initializeSeriesColors(
    data,
    seriesKey,
    seriesColorMap,
    customColorScale
  ) {
    let seriesKeys = new Set(data.map((d) => d[seriesKey]));
    let colorScale = d3.scaleOrdinal(customColorScale).domain(seriesKeys);
    // let colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(seriesKeys);
    seriesKeys.forEach((key) => {
      seriesColorMap.set(key, colorScale(key));
    });
  }

  export function drawHeatPoint(
    svg,
    data,
    rScale,
    angleSlice,
    config,
    color,
    selectedSeries
  ) {
    data.forEach((values, key) => {
      const newValues = values[config.dataKey].filter((d) =>
        selectedSeries.has(d[config.seriesKey])
      );
      const keyPercentage = (key / data.length) * 100;
      const opacityRange = [0.1, 0.3];
      const radiusRange = [20, 3];
      const radius =
        radiusRange[0] +
        (radiusRange[1] - radiusRange[0]) * (keyPercentage / 100);
      const opacity =
        opacityRange[0] +
        (opacityRange[1] - opacityRange[0]) * (keyPercentage / 100);

      const points = svg
        .append("g")
        .selectAll(".dot")
        .data(newValues)
        .enter()
        .append("circle")
        .attr(
          "cx",
          (d, j) =>
            rScale(d[config.yKey]) * Math.cos(angleSlice * j - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, j) =>
            rScale(d[config.yKey]) * Math.sin(angleSlice * j - Math.PI / 2)
        )
        .attr("r", radius)
        .style("fill", (d) => color(d.room))
        .style("fill-opacity", opacity);
    });
  }

  export function initializeSVG(margin, width, height) {
    d3.select("#radarChart").selectAll("*").remove();
    return d3
      .select("#radarChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left},${height / 2 + margin.top})`
      );
  }

  export function calculateAngleSlice(data) {
    return (Math.PI * 2) / Array.from(data.values())[0].length;
  }

  export function initializeScale(radius) {
    return d3.scaleLinear().range([0, radius]).domain([0, 10]);
  }

  export function drawGrid(svg, radius) {
    const axisGrid = svg.append("g").attr("class", "axisWrapper");

    axisGrid
      .selectAll(".levels")
      .data(d3.range(1, 11).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d) => (radius / 10) * d)
      .style("fill", "none")
      .style("stroke", "#CDCDCD")
      .style("stroke-width", 1)
      .style("stroke-opacity", 0.75);
  }
  export function drawAxis(svg, data, rScale, angleSlice, config) {
    svg
      .selectAll(".axis")
      .data(Array.from(data.values())[0])
      .enter()
      .append("g")
      .attr("class", "axis")
      .each(function (d, i) {
        const x2 = rScale(10) * Math.cos(angleSlice * i - Math.PI / 2);
        const y2 = rScale(10) * Math.sin(angleSlice * i - Math.PI / 2);

        d3.select(this)
          .append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", x2)
          .attr("y2", y2)
          .style("stroke", "lightgrey")
          .style("stroke-width", "1px");

        const labelOffset = 20; // Adjust this value to increase/decrease the space

        d3.select(this)
          .append("text")
          .attr(
            "x",
            (rScale(10) + labelOffset) * Math.cos(angleSlice * i - Math.PI / 2)
          )
          .attr(
            "y",
            (rScale(10) + labelOffset) * Math.sin(angleSlice * i - Math.PI / 2)
          )
          .attr("dy", "0.35em")
          .style("font-size", "10px")
          .attr("text-anchor", "middle")
          .text(d[config.xKey]);

        // Add a small circle at the tip of the axis line
        d3.select(this)
          .append("circle")
          .attr("cx", x2)
          .attr("cy", y2)
          .attr("r", 2) // Radius of the small circle
          .style("fill", "lightgrey");
      });
  }

  export function drawRadarAreas(
    svg,
    data,
    rScale,
    angleSlice,
    initialLoad,
    seriesColorMap,
    config
  ) {
    const radarArea = d3
      .areaRadial()
      .angle((d, i) => i * angleSlice)
      .innerRadius(0)
      .outerRadius((d) => rScale(d[config.yKey]))
      .curve(d3.curveLinearClosed);

    data.forEach((values, key) => {
      const path = svg
        .append("path")
        .datum(values)
        .attr("d", radarArea)
        .style("fill", seriesColorMap.get(key))
        .style("fill-opacity", 0.1);

      if (initialLoad) {
        path
          .attr("d", radarArea.innerRadius(0).outerRadius(0))
          .transition()
          .duration(1000)
          .attr("d", radarArea);
      } else {
        path.transition().duration(1000).attr("d", radarArea);
      }
    });
  }

  function shadeSegment(svg, rScale, angleSlice, config, shadedSegment) {
    const { startAxis, endAxis, color, opacity } = shadedSegment;

    const startAngle = angleSlice * startAxis - Math.PI / 2;
    const endAngle = angleSlice * endAxis - Math.PI / 2;

    const segmentData = [
      { angle: startAngle, radius: 0 },
      { angle: startAngle, radius: rScale(10) },
      { angle: endAngle, radius: rScale(10) },
      { angle: endAngle, radius: 0 },
    ];

    const segmentPath = d3
      .lineRadial()
      .angle((d) => d.angle)
      .radius((d) => d.radius)
      .curve(d3.curveLinearClosed);

    svg
      .append("path")
      .datum(segmentData)
      .attr("d", segmentPath)
      .style("fill", color)
      .style("fill-opacity", opacity);
  }

  function shadeSegments(svg, rScale, angleSlice, config, shadedSegments) {
    shadedSegments.forEach((segment) =>
      shadeSegment(svg, rScale, angleSlice, config, segment)
    );
  }

  export function drawRadarLines(
    svg,
    data,
    rScale,
    angleSlice,
    initialLoad,
    seriesColorMap,
    config
  ) {
    const radarLine = d3
      .lineRadial()
      .radius((d) => rScale(d[config.yKey]))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    data.forEach((values, key) => {
      const path = svg
        .append("path")
        .datum(values)
        .attr("d", radarLine)
        .style("fill", "none")
        .style("stroke", seriesColorMap.get(key))
        .style("stroke-width", 1);

      if (initialLoad) {
        path
          .attr(
            "d",
            radarLine.radius(() => 0)
          )
          .transition()
          .duration(1000)
          .attr("d", radarLine);
      } else {
        path.transition().duration(1000).attr("d", radarLine);
      }
    });
  }
  export function drawRadarPoints(
    svg,
    data,
    rScale,
    angleSlice,
    initialLoad,
    seriesColorMap,
    show,
    config
  ) {
    data.forEach((values, key) => {
      const points = svg.append("g").selectAll(".dot").data(values).enter();

      // Outer colored circle
      points
        .append("circle")
        .attr(
          "cx",
          (d, j) =>
            rScale(d[config.yKey]) * Math.cos(angleSlice * j - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, j) =>
            rScale(d[config.yKey]) * Math.sin(angleSlice * j - Math.PI / 2)
        )
        .attr("r", 3) // Outer circle radius
        .style("fill", seriesColorMap.get(key))
        .style("stroke", "none");

      // Inner white circle
      points
        .append("circle")
        .attr(
          "cx",
          (d, j) =>
            rScale(d[config.yKey]) * Math.cos(angleSlice * j - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, j) =>
            rScale(d[config.yKey]) * Math.sin(angleSlice * j - Math.PI / 2)
        )
        .attr("r", 2) // Inner circle radius (smaller than outer circle)
        .style("fill", "#fff")
        .style("stroke", seriesColorMap.get(key))
        .style("stroke-width", 1)
        .on("mouseover", function (event, d) {
          if (show.tooltip) {
            d3.select(".tooltip")
              .style("opacity", 0.9)
              .html(`Insight: ${d[config.xKey]}<br>Value: ${d[config.yKey]}`);
          }
        })
        .on("mousemove", function (event) {
          if (show.tooltip) {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
          }
        })
        .on("mouseout", function () {
          if (show.tooltip) {
            d3.select(".tooltip").style("opacity", 0);
          }
        });

      // Adding invisible larger circles for hover near functionality
      svg
        .append("g")
        .selectAll(".hover-area")
        .data(values)
        .enter()
        .append("circle")
        .attr(
          "cx",
          (d, j) =>
            rScale(d[config.yKey]) * Math.cos(angleSlice * j - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, j) =>
            rScale(d[config.yKey]) * Math.sin(angleSlice * j - Math.PI / 2)
        )
        .attr("r", 10) // Larger radius for easier hover targeting
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (event, d) {
          if (show.tooltip) {
            d3.select(".tooltip")
              .style("opacity", 0.9)
              .html(`Insight: ${d[config.xKey]}<br>Value: ${d[config.yKey]}`);
          }
        })
        .on("mousemove", function (event) {
          if (show.tooltip) {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
          }
        })
        .on("mouseout", function () {
          if (show.tooltip) {
            d3.select(".tooltip").style("opacity", 0);
          }
        });
    });
  }

  export let config;
  export let data: any[] = [{ room: "", insight: "", value: 0 }];
  export let allData: any[] = [];

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

  let nestedData;
  let color = d3.scaleOrdinal(config.colors);
  // let color = d3.scaleOrdinal(d3.schemeCategory10);
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

    // Shade segments on top of data but below the grid
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
    // Adding horizontal line with labels
    svg
      .append("line")
      .attr("x1", -radius)
      .attr("y1", 0)
      .attr("x2", radius)
      .attr("y2", 0)
      .style("stroke", "#7597C9")
      .style("stroke-width", 1);

    // Adding house icon above "Structural" text
    svg
      .append("foreignObject")
      .attr("x", -radius - 30)
      .attr("y", -40)
      .attr("width", 19)
      .attr("height", 18)
      .append("xhtml:div")
      .html(
        '<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.86778 11.0601H7.12411V17.3186H2.42579V9.5H0.59668L9.09668 1" stroke="#7597C9" stroke-width="0.5"/><path d="M8.32558 11.0601H11.0693V17.3186H15.7676V9.5H17.5967L9.09668 1" stroke="#7597C9" stroke-width="0.5"/></svg>'
      );

    // Adding structural text with border
    svg
      .append("rect")
      .attr("x", -radius - 60)
      .attr("y", -18)
      .attr("width", 50)
      .attr("height", 20)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("fill", "none")
      .style("stroke", "#7597C9")
      .style("stroke-width", 1);

    svg
      .append("text")
      .attr("x", -radius - 35)
      .attr("y", -10)
      .attr("dy", "0.35em")
      .style("font-size", "10px") // Smaller font size
      .attr("text-anchor", "middle")
      .style("fill", "#7597C9")
      .text("Structural");

    // Adding people icon below "Environmental" text
    svg
      .append("foreignObject")
      .attr("x", -radius - 35)
      .attr("y", 20) // Adjusted y position to avoid clipping
      .attr("width", 24)
      .attr("height", 15)
      .append("xhtml:div")
      .html(
        '<svg width="24" height="11" viewBox="0 0 24 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12.1169" cy="3.27701" r="2.48649" stroke="#7597C9" stroke-width="0.5"/><circle cx="5.63028" cy="2.73649" r="2.48649" stroke="#7597C9" stroke-width="0.5"/><circle cx="2.73649" cy="2.73649" r="2.48649" transform="matrix(-1 0 0 1 21.3401 0)" stroke="#7597C9" stroke-width="0.5"/><path d="M7.08325 10C7.36478 8.67118 8.75217 6.01352 12.0495 6.01352C15.3468 6.01352 16.8693 8.67118 17.2184 10" stroke="#7597C9" stroke-width="0.5"/><path d="M0.59668 9.45945C0.878211 8.13062 2.2656 5.47296 5.5629 5.47296C6.63242 5.47296 7.51522 5.75258 8.23181 6.17577" stroke="#7597C9" stroke-width="0.5"/><path d="M23.6372 9.45945C23.3557 8.13062 21.9683 5.47296 18.671 5.47296C17.6015 5.47296 16.7187 5.75258 16.0021 6.17577" stroke="#7597C9" stroke-width="0.5"/></svg>'
      );

    // Adding environmental text with border
    svg
      .append("rect")
      .attr("x", -radius - 82)
      .attr("y", 5)
      .attr("width", 75)
      .attr("height", 20)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("fill", "none")
      .style("stroke", "#7597C9")
      .style("stroke-width", 1);

    svg
      .append("text")
      .attr("x", -radius - 10)
      .attr("y", 13)
      .attr("dy", "0.35em")
      .style("font-size", "10px") // Smaller font size
      .attr("text-anchor", "end")
      .style("fill", "#7597C9")
      .text("Environmental");

    // Define arrow markers for the vertical line
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow-up")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M 1 3 L 5 8 L 9 3")
      .attr("orient", "90")
      .style("fill", "none")
      .style("stroke", "#7597C9")
      .style("stroke-width", 1.5);

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow-down")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M 1 7 L 5 2 L 9 7")
      .style("fill", "none")
      .style("stroke", "#7597C9")
      .style("stroke-width", 1.5);

    // Adding vertical line with arrows, 4 rem (64 pixels) tall
    const lineHeight = 4 * 16; // 4 rem in pixels
    const lineY1 = -lineHeight / 2;
    const lineY2 = lineHeight / 2;

    svg
      .append("line")
      .attr("x1", -radius)
      .attr("y1", lineY1)
      .attr("x2", -radius)
      .attr("y2", lineY2)
      .style("stroke", "#7597C9")
      .style("stroke-width", 1)
      .attr("marker-start", "url(#arrow-down)")
      .attr("marker-end", "url(#arrow-up)");

    // Adding vertical line with arrows at 90 degrees to the horizontal line
  }

  function drawLegend() {
    // This function is now a placeholder as the legend will be rendered in the markup section
  }

  function toggleSeries(d) {
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

  function toggleShow(option) {
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

  export function addTooltip() {
    d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  function drawToggles() {
    // This function is now a placeholder as the toggles will be rendered in the markup section
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
