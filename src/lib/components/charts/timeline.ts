import * as d3 from "d3";

export function createPlayPauseButton(container, isPlaying, togglePlay) {
  const playPauseButton = container
    .append("svg")
    .attr("width", 30)
    .attr("height", 40)
    .style("cursor", "pointer")
    .style("margin-right", "10px")
    .on("click", () => togglePlay());

  createPlayPauseRects(playPauseButton, isPlaying);
  createPlayPausePolygon(playPauseButton, isPlaying);
}

export function createPlayPauseRects(svg, isPlaying) {
  svg
    .append("rect")
    .attr("x", 8)
    .attr("y", 8)
    .attr("width", 6)
    .attr("height", 24)
    .attr("fill", "#7597C9")
    .attr("display", isPlaying ? "block" : "none");

  svg
    .append("rect")
    .attr("x", 16)
    .attr("y", 8)
    .attr("width", 6)
    .attr("height", 24)
    .attr("fill", "#7597C9")
    .attr("display", isPlaying ? "block" : "none");
}

export function createPlayPausePolygon(svg, isPlaying) {
  svg
    .append("polygon")
    .attr("points", "10,5 10,35 25,20")
    .attr("fill", "#7597C9")
    .attr("display", isPlaying ? "none" : "block");
}

export function createSlider(container, handleRadius, sliderWidth, position, handleDrag, handleDragEnd) {
  const svg = container.append("svg").attr("width", "100%").attr("height", 40);

  createSliderLine(svg, handleRadius, sliderWidth);
  createSliderHandle(svg, handleRadius, position, handleDrag, handleDragEnd);
}

export function createSliderLine(svg, handleRadius, sliderWidth) {
  svg
    .append("line")
    .attr("x1", handleRadius)
    .attr("y1", 20)
    .attr("x2", sliderWidth + handleRadius)
    .attr("y2", 20)
    .attr("stroke", "lightgray")
    .attr("stroke-width", 2);
}

export function createSliderHandle(svg, handleRadius, position, handleDrag, handleDragEnd) {
  const handle = svg
    .append("circle")
    .attr("cx", handleRadius)
    .attr("cy", 20)
    .attr("r", handleRadius)
    .attr("fill", "white")
    .attr("stroke", "#7597C9")
    .attr("stroke-width", 2)
    .call(
      d3
        .drag()
        .on("start", event => handleDrag(event, handleRadius, svg.attr("width"), position))
        .on("drag", event => handleDrag(event, handleRadius, svg.attr("width"), position))
        .on("end", handleDragEnd)
    );

  position.subscribe((value) => {
    handle.attr("cx", value + handleRadius);
  });
}

export function createRewindButton(container, rewind) {
  const rewindButton = container
    .append("svg")
    .attr("width", 30)
    .attr("height", 40)
    .style("cursor", "pointer")
    .style("margin-left", "10px")
    .on("click", () => rewind());

  rewindButton
    .append("polygon")
    .attr("points", "20,5 20,35 5,20")
    .attr("fill", "#7597C9");
}

export function createNumOfDaysText(container, numOfDays) {
  container
    .append("div")
    .attr("class", "num-of-days-text")
    .style("text-align", "center")
    .style("margin-top", "10px")
    .style("font-size", "0.8rem")
    .text(`Last ${numOfDays} days`);
}

export function initD3Timeline(
  timeline,
  data,
  position,
  handleRadius,
  sliderWidth,
  isPlaying,
  togglePlay,
  rewind,
  dispatch,
  speed,
  handleDrag,
  handleDragEnd
) {
  if (!timeline) return;

  d3.select(timeline).selectAll("*").remove();

  const container = d3
    .select(timeline)
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");

  const controlsContainer = container
    .append("div")
    .style("display", "flex")
    .style("align-items", "center");

  createPlayPauseButton(controlsContainer, isPlaying, togglePlay);
  createSlider(
    controlsContainer,
    handleRadius,
    sliderWidth,
    position,
    (event) => handleDrag(event, handleRadius, sliderWidth, position, data, dispatch),
    handleDragEnd
  );
  createRewindButton(controlsContainer, () =>
    rewind(position, data, dispatch)
  );
  createNumOfDaysText(container, calculateNumOfDays(data));
}

export function updatePlayPauseButton(timeline, isPlaying) {
  d3.select(timeline)
    .select("svg:nth-child(1)")
    .selectAll("rect")
    .attr("display", isPlaying ? "block" : "none");
  d3.select(timeline)
    .select("svg:nth-child(1)")
    .selectAll("polygon")
    .attr("display", isPlaying ? "none" : "block");
}

export function calculateNumOfDays(data) {
  const startDate = new Date(data[0].date);
  const endDate = new Date(data[data.length - 1].date);
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

export function updateNumOfDaysText(timeline, numOfDays) {
  d3.select(timeline)
    .select(".num-of-days-text")
    .text(`Last ${numOfDays} days`);
}

export function handleDrag(
  event,
  handleRadius,
  sliderWidth,
  position,
  data,
  dispatch
) {
  console.log('handleDrag:', { event, handleRadius, sliderWidth, position, data });

  if (!data || data.length === 0) {
    console.error('Data is not defined or empty');
    return;
  }

  let xPos = event.x - handleRadius;
  if (xPos < 0) xPos = 0;
  if (xPos > sliderWidth) xPos = sliderWidth;

  position.set(xPos);

  const date =
    new Date(data[0].date).getTime() +
    (xPos / sliderWidth) *
      (new Date(data[data.length - 1].date).getTime() -
        new Date(data[0].date).getTime());
  const closestDate = data.reduce((prev, curr) => {
    return Math.abs(new Date(curr.date).getTime() - date) <
      Math.abs(new Date(prev.date).getTime() - date)
      ? curr
      : prev;
  }).date;

  dispatch("dateSelected", closestDate);
}

export function handleDragEnd() {
  // Logic for handleDragEnd if needed
}
