// xy.ts

import * as d3 from "d3";

export function parseDate(dateStr: string) {
  return d3.isoParse(dateStr);
}

export function createSvg(svgElement: any, width: number, height: number, margin: any) {
  const svg = d3
    .select(svgElement)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  return svg;
}

export function createScales(data: any, width: number, height: number) {
  const allValues = data.flatMap((series: any) => series.values);

  const x = d3
    .scaleTime()
    .domain(d3.extent(allValues, (d: any) => parseDate(d.date)))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(allValues, (d: any) => d.value)])
    .range([height, 0]);

  return { x, y };
}

export function addGridLines(svg: any, x: any, y: any, width: number, height: number, config: any) {
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

export function addAxes(svg: any, x: any, y: any, height: number, config: any) {
  const xAxis = svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`)
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

  xAxis.selectAll("path").attr("stroke", "#4083b9");
  xAxis.selectAll("line").attr("stroke", "#4083b9");
  yAxis.selectAll("path").attr("stroke", "#4083b9");
  yAxis.selectAll("line").attr("stroke", "#4083b9");

  xAxis.selectAll("text").attr("fill", "#000000");
  yAxis.selectAll("text").attr("fill", "#000000");
}

export function addAreas(svg: any, data: any, x: any, y: any, config: any, color: any, selectedSeries: Set<any>) {
  data.forEach((series: any, index: number) => {
    if (selectedSeries.has(series.location)) {
      const area = d3
        .area()
        .x((d: any) => x(parseDate(d.date)))
        .y0(y(0))
        .y1((d: any) => y(d.value));

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

export function addLines(svg: any, data: any, x: any, y: any, config: any, color: any, selectedSeries: Set<any>) {
  data.forEach((series: any, index: number) => {
    if (selectedSeries.has(series.location)) {
      const line = d3
        .line()
        .x((d: any) => x(parseDate(d.date)))
        .y((d: any) => y(d.value));

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

export function addPoints(svg: any, data: any, x: any, y: any, config: any, color: any, selectedSeries: Set<any>) {
  data.forEach((series: any, index: number) => {
    if (selectedSeries.has(series.location)) {
      svg
        .selectAll(`circle.series-${index}`)
        .data(series.values)
        .enter()
        .append("circle")
        .attr("class", `point series-${index}`)
        .attr("cx", (d: any) => x(parseDate(d.date)))
        .attr("cy", (d: any) => y(d.value))
        .attr("r", config.pointRadius || 2)
        .attr("fill", color(index));
    }
  });
}

export function addLegend(svg: any, data: any, width: number, margin: any, config: any, color: any, selectedSeries: Set<any>, toggleSeries: any) {
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width + 10}, 20)`);

  data.forEach((series: any, index: number) => {
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

export function addTooltip() {
  d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
}

export function drawToggles(svg: any, width: number, height: number, show: any, startGraph: any) {
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
    .attr("cy", (d: any, i: number) => 15 + i * 20)
    .attr("r", 5)
    .style("fill", (d: any) => (show[d] ? "blue" : "white"))
    .style("stroke", "black")
    .style("stroke-width", 1)
    .on("click", function (event: any, d: any) {
      show[d] = !show[d];
      startGraph();
    });

  toggles
    .selectAll("text")
    .data(toggleData)
    .enter()
    .append("text")
    .attr("x", 30)
    .attr("y", (d: any, i: number) => 20 + i * 20)
    .style("font-size", "10px")
    .attr("alignment-baseline", "middle")
    .text((d: any) => d);
}

export function initializeShow(config: any) {
  const defaultFeatures = config.defaultFeatures || [];
  const features = [
    'grid',
    'axis',
    'areas',
    'lines',
    'points',
    // 'legend',
    // 'tooltip',
    'heat'
  ];

  const show: { [key: string]: boolean } = {};

  features.forEach(feature => {
    show[feature] = defaultFeatures.length > 0
      ? defaultFeatures.includes(feature)
      : config.show.includes(feature);
  });

  return show;
}

export function useScales(data: any, width: number, height: number) {
  const allValues = data.flatMap((series: any) => series.values);

  const x = d3
    .scaleTime()
    .domain(d3.extent(allValues, (d: any) => parseDate(d.date)))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(allValues, (d: any) => d.value)])
    .range([height, 0]);

  return { x, y };
}

export function useColors(config: any, series: any) {
  const color = d3.scaleOrdinal(config.colors);
  let seriesColorMap = new Map();
  series.forEach((s: any, i: number) => {
    seriesColorMap.set(s, color(i));
  });
  return { color, seriesColorMap };
}

export function useZoom(svgElement: any, x: any, y: any, width: number, height: number, config: any, show: any, data: any, color: any, selectedSeries: any, addGridLines: any, addAxes: any, addAreas: any, addLines: any, addPoints: any) {
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
    .on("zoom", (event: any) => {
      const newX = event.transform.rescaleX(x);
      const newY = event.transform.rescaleY(y);

      const svg = d3.select(svgElement);
      svg.selectAll(".grid").remove();
      svg.selectAll(".axis").remove();
      svg.selectAll(".area").remove();
      svg.selectAll(".line").remove();
      svg.selectAll(".point").remove();

      if (show.grid) addGridLines(svg, newX, newY, width, height, config);
      if (show.axis) addAxes(svg, newX, newY, height, config);

      const graphGroup = svg.append("g").attr("clip-path", "url(#clip)");

      if (show.areas) addAreas(graphGroup, data, newX, newY, config, color, selectedSeries);
      if (show.lines) addLines(graphGroup, data, newX, newY, config, color, selectedSeries);
      if (show.points) addPoints(graphGroup, data, newX, newY, config, color, selectedSeries);
    });

  d3.select(svgElement).call(zoom);

  d3.select(svgElement).on("contextmenu", (event: any) => {
    event.preventDefault();
    d3.select(svgElement)
      .transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  });
}
