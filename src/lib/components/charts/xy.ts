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

export function addGridLines({svg, x, y, width, height, ticks}: any) {
  svg
    .append("g")
    .attr("class", "grid x-grid")
    .attr("color", "lightgray")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3.axisBottom(x).ticks(ticks).tickSize(-height).tickFormat("")
    );

  svg
    .append("g")
    .attr("color", "lightgray")
    .attr("class", "grid y-grid")
    .call(d3.axisLeft(y).ticks(ticks).tickSize(-width).tickFormat(""));
}

export function addAxes({svg, x, y, height, ticks}: any) {
  const xAxis = svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(ticks)
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

export function addAreas({svg, data, x, y, color, selectedSeries, seriesKey}: any, newScales?: any) {
  if (newScales) {
    x = newScales.x;
    y = newScales.y;
  }

  data.forEach((series: any, index: number) => {
    if (selectedSeries.has(series[seriesKey])) {
      const area = d3
        .area()
        .x((d: any) => x(parseDate(d.date)))
        .y0(y(0))
        .y1((d: any) => y(d.value));

      const path = svg.select(`.area.series-${index}`);
      if (path.empty()) {
        svg
          .append("path")
          .datum(series.values)
          .attr("class", `area series-${index}`)
          .attr("fill", color(index))
          .attr("opacity", 0.3)
          .attr("d", area);
      } else {
        path.attr("d", area);
      }
    }
  });
}

export function addLines({svg, data, x, y, color, selectedSeries, lineWidth, seriesKey}: any, newScales?: any) {
  if (newScales) {
    x = newScales.x;
    y = newScales.y;
  }
  data.forEach((series: any, index: number) => {
    if (selectedSeries.has(series[seriesKey])) {
      const line = d3
        .line()
        .x((d: any) => x(parseDate(d.date)))
        .y((d: any) => y(d.value));

      const path = svg.select(`.line.series-${index}`);
      if (path.empty()) {
        svg
          .append("path")
          .datum(series.values)
          .attr("class", `line series-${index}`)
          .attr("fill", "none")
          .attr("stroke", color(index))
          .attr("stroke-width", lineWidth || 1.5)
          .attr("d", line);
      } else {
        path.attr("d", line);
      }
    }
  });
}

export function addPoints({svg, data, x, y, color, selectedSeries, pointRadius, seriesKey}: any, newScales?: any) {
  if (newScales) {
    x = newScales.x;
    y = newScales.y;
  }

  data.forEach((series: any, index: number) => {
    if (selectedSeries.has(series[seriesKey])) {
      const points = svg.selectAll(`circle.series-${index}`).data(series.values);

      points.enter()
        .append("circle")
        .attr("class", `point series-${index}`)
        .attr("cx", (d: any) => x(parseDate(d.date)))
        .attr("cy", (d: any) => y(d.value))
        .attr("r", pointRadius || 2)
        .attr("fill", color(index));

      points
        .attr("cx", (d: any) => x(parseDate(d.date)))
        .attr("cy", (d: any) => y(d.value));
    }
  });
}

export function addLegend({svg, data, width, color, selectedSeries, toggleSeries, seriesKey}: any) {
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
        selectedSeries.has(series[seriesKey]) ? color(index) : "white"
      )
      .style("stroke", color(index))
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", function () {
        toggleSeries(series[seriesKey]);
      });

    legendRow
      .append("text")
      .attr("x", 15)
      .attr("y", 10)
      .style("font-size", "10px")
      .attr("text-anchor", "start")
      .style("text-transform", "capitalize")
      .text(series[seriesKey]);
  });
}

export function addTooltip() {
  d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
}

export function drawToggles({svg, width, show, startGraph}: any) {
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

export function initializeShow({defaultFeatures}) {
  const features = [
    'grid',
    'axis',
    'areas',
    'lines',
    'points',
    'heat'
  ];

  const show: { [key: string]: boolean } = {};

  features.forEach(feature => {
    show[feature] = defaultFeatures.length > 0
      ? defaultFeatures.includes(feature)
      : show.includes(feature);
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

export function useColors({colors, series}) {
  const color = d3.scaleOrdinal(colors);
  let seriesColorMap = new Map();
  series.forEach((s: any, i: number) => {
    seriesColorMap.set(s, color(i));
  });
  return { color, seriesColorMap };
}

export function useZoom({svgElement, x, y, width, height, show, data, color, selectedSeries, ticks, lineWidth, pointWidth, seriesKey}) {
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .extent([[0, 0], [width, height]])
    .translateExtent([[0, 0], [width, height]]) // Restrict panning
    .on("zoom", zoomed);

  d3.select(svgElement).call(zoom);

  function zoomed(event) {
    const transform = event.transform;
    const newX = transform.rescaleX(x);
    const newY = transform.rescaleY(y);

    constrainDomain(newX, x);
    constrainDomain(newY, y);

    if (show.grid) updateGrid(newX, newY);
    if (show.axis) updateAxes(newX, newY);
    const newScales = { x: newX, y: newY };
    updateGraphElements(newScales);
  }

  function constrainDomain(newScale, originalScale) {
    const [newMin, newMax] = newScale.domain();
    const [originalMin, originalMax] = originalScale.domain();

    if (newMin < originalMin) {
      newScale.domain([originalMin, newMax - (newMin - originalMin)]);
    }
    if (newMax > originalMax) {
      newScale.domain([newMin - (newMax - originalMax), originalMax]);
    }
  }

  function updateGrid(newX, newY) {
    d3.select(svgElement).select(".x-grid")
      .call(d3.axisBottom(newX).ticks(ticks).tickSize(-height).tickFormat(""));
    d3.select(svgElement).select(".y-grid")
      .call(d3.axisLeft(newY).ticks(ticks).tickSize(-width).tickFormat(""));
  }

  function updateAxes(newX, newY) {
    d3.select(svgElement).select(".x-axis")
      .call(d3.axisBottom(newX).ticks(ticks).tickFormat(d3.timeFormat("%d/%m/%Y")));
    d3.select(svgElement).select(".y-axis")
      .call(d3.axisLeft(newY).ticks(ticks));
  }

  function updateGraphElements(newScales) {
    const graphGroup = d3.select(svgElement).select("g");

    if (show.areas) addAreas({svg: graphGroup, data, x, y, color, selectedSeries, seriesKey}, newScales);
    if (show.lines) addLines({svg: graphGroup, data, x, y, color, selectedSeries, lineWidth, seriesKey}, newScales);
    if (show.points) addPoints({svg: graphGroup, data, x, y, color, selectedSeries, pointRadius: pointWidth, seriesKey}, newScales);
  }
}

export function initializeXYElements(
  {svg, graphGroup, data, x, y, color, selectedSeries, show, width, height, lineWidth, pointWidth, seriesKey, config}: any
) {

  if (show.grid) addGridLines({svg, x, y, width, height});
  if (show.axis) addAxes({svg, x, y, height});
  if (show.areas) addAreas({svg: graphGroup, data, x, y, color, selectedSeries, seriesKey});
  if (show.lines) addLines({svg: graphGroup, data, x, y, color, selectedSeries, lineWidth, seriesKey});
  if (show.points) addPoints({svg: graphGroup, data, x, y, color, selectedSeries, pointRadius: pointWidth, seriesKey});
}
