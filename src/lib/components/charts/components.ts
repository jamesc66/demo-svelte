  import * as d3 from "d3";

  export function initializeSeriesColors(data, seriesKey, seriesColorMap) {
    let seriesKeys = new Set(data.map((d) => d[seriesKey]));
    let colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(seriesKeys);
    seriesKeys.forEach((key) => {
      seriesColorMap.set(key, colorScale(key));
    });
  }


  export function drawHeatPoint(svg, data, rScale, angleSlice, config, color, selectedSeries) {
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
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);

    const levels = d3.range(0, 11, 1);
    svg
      .selectAll(".axisLabel")
      .data(levels)
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr("x", (d) => d * (radius / 10) * Math.cos(Math.PI / 2) + 10)
      .attr("y", (d) => d * (radius / 10) * Math.sin(Math.PI / 2))
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .attr("text-anchor", "middle")
      .text((d) => d);
  }

  export function drawAxis(svg, data, rScale, angleSlice, config) {
    svg
      .selectAll(".axis")
      .data(Array.from(data.values())[0])
      .enter()
      .append("g")
      .attr("class", "axis")
      .each(function (d, i) {
        d3.select(this)
          .append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", rScale(10) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("y2", rScale(10) * Math.sin(angleSlice * i - Math.PI / 2))
          .style("stroke", "grey")
          .style("stroke-width", "2px");

        d3.select(this)
          .append("text")
          .attr("x", rScale(10) * Math.cos(angleSlice * i - Math.PI / 2) + 10)
          .attr("y", rScale(10) * Math.sin(angleSlice * i - Math.PI / 2))
          .attr("dy", "0.35em")
          .style("font-size", "10px")
          .attr("text-anchor", "middle")
          .text(d[config.xKey]);
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
        .style("stroke-width", 2);

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
      const points = svg
        .append("g")
        .selectAll(".dot")
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
        .attr("r", 3)
        .style("fill", seriesColorMap.get(key))
        .style("stroke", "#fff")
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
