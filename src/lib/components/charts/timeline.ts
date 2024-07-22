import * as d3 from "d3";

export interface TimelineData {
  date: string;
  insight: Insight[];
}

export interface Insight {
  room: string;
  insight: string;
  value: number;
}

export type SelectDateFunction = (type: string, detail?: any) => void;

export interface InitD3TimelineParams {
  timeline: HTMLDivElement | null;
  data: TimelineData[];
  handleRadius: number;
  sliderWidth: number;
  isPlaying: boolean;
  togglePlay: () => void;
  rewind: () => void;
  selectDate: SelectDateFunction;
  speed: number;
  handleDrag: (event: any) => void;
  handleDragEnd: () => void;
}

export function calculateNumOfDays(data: TimelineData[]): number {
  const startDate = new Date(data[0].date);
  const endDate = new Date(data[data.length - 1].date);
  return Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function createPlayPauseButton(params: {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  isPlaying: boolean;
  togglePlay: () => void;
}): void {
  const { container, isPlaying, togglePlay } = params;
  const playPauseButton = container
    .append<SVGSVGElement>("svg")
    .attr("width", 30)
    .attr("height", 40)
    .style("cursor", "pointer")
    .style("margin-right", "10px")
    .on("click", () => togglePlay());
  playPauseButton
    .append("rect")
    .attr("x", 8)
    .attr("y", 8)
    .attr("width", 6)
    .attr("height", 24)
    .attr("fill", "#7597C9")
    .attr("display", isPlaying ? "block" : "none");
  playPauseButton
    .append("rect")
    .attr("x", 16)
    .attr("y", 8)
    .attr("width", 6)
    .attr("height", 24)
    .attr("fill", "#7597C9")
    .attr("display", isPlaying ? "block" : "none");
  playPauseButton
    .append("polygon")
    .attr("points", "10,5 10,35 25,20")
    .attr("fill", "#7597C9")
    .attr("display", isPlaying ? "none" : "block");
}

export function createSlider(params: {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  handleRadius: number;
  sliderWidth: number;
  handleDrag: (event: any) => void;
  handleDragEnd: () => void;
}): void {
  const { container, handleRadius, sliderWidth, handleDrag, handleDragEnd } =
    params;
  const svg = container
    .append<SVGSVGElement>("svg")
    .attr("width", sliderWidth + handleRadius * 2)
    .attr("height", 40);
  svg
    .append("line")
    .attr("x1", handleRadius)
    .attr("y1", 20)
    .attr("x2", sliderWidth + handleRadius)
    .attr("y2", 20)
    .attr("stroke", "lightgray")
    .attr("stroke-width", 2);
  svg
    .append<SVGCircleElement>("circle")
    .attr("cx", handleRadius)
    .attr("cy", 20)
    .attr("r", handleRadius)
    .attr("fill", "white")
    .attr("stroke", "#7597C9")
    .attr("stroke-width", 2)
    .call(
      d3
        .drag<SVGCircleElement, unknown>()
        .on("drag", handleDrag)
        .on("end", handleDragEnd)
    );
}

export function createRewindButton(params: {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  rewind: () => void;
}): void {
  const { container, rewind } = params;
  const rewindButton = container
    .append<SVGSVGElement>("svg")
    .attr("width", 30)
    .attr("height", 40)
    .style("cursor", "pointer")
    .style("margin-left", "10px")
    .on("click", rewind);
  rewindButton
    .append("polygon")
    .attr("points", "20,5 20,35 5,20")
    .attr("fill", "#7597C9");
}

export function createNumOfDaysText(params: {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  numOfDays: number;
}): void {
  const { container, numOfDays } = params;
  container
    .append<HTMLDivElement>("div")
    .attr("class", "num-of-days-text")
    .style("text-align", "center")
    .style("margin-top", "10px")
    .style("font-size", "0.8rem")
    .text(`Last ${numOfDays} days`);
}

export function initD3Timeline(params: InitD3TimelineParams): void {
  const {
    timeline,
    data,
    handleRadius,
    sliderWidth,
    isPlaying,
    togglePlay,
    rewind,
    selectDate,
    speed,
    handleDrag,
    handleDragEnd,
  } = params;
  if (!timeline) return;
  d3.select(timeline).selectAll("*").remove();
  const container = d3
    .select<HTMLDivElement, unknown>(timeline)
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");
  const controlsContainer = container
    .append<HTMLDivElement>("div")
    .style("display", "flex")
    .style("align-items", "center");
  createPlayPauseButton({
    container: controlsContainer,
    isPlaying,
    togglePlay,
  });
  createSlider({
    container: controlsContainer,
    handleRadius,
    sliderWidth,
    handleDrag,
    handleDragEnd,
  });
  createRewindButton({ container: controlsContainer, rewind });
  createNumOfDaysText({ container, numOfDays: calculateNumOfDays(data) });
}

export function updatePlayPauseButton(params: {
  timeline: HTMLElement;
  isPlaying: boolean;
}): void {
  const { timeline, isPlaying } = params;
  d3.select(timeline)
    .select("svg:nth-child(1)")
    .selectAll<SVGRectElement, unknown>("rect")
    .attr("display", isPlaying ? "block" : "none");
  d3.select(timeline)
    .select("svg:nth-child(1)")
    .selectAll<SVGPolygonElement, unknown>("polygon")
    .attr("display", isPlaying ? "none" : "block");
}

export function updateNumOfDaysText(params: {
  timeline: HTMLElement;
  numOfDays: number;
}): void {
  const { timeline, numOfDays } = params;
  d3.select(timeline)
    .select<HTMLDivElement>(".num-of-days-text")
    .text(`Last ${numOfDays} days`);
}

export function handleDrag(
  event: any,
  handleRadius: number,
  sliderWidth: number,
  setPosition: (value: number) => void,
  data: TimelineData[],
  selectDate: SelectDateFunction
): void {
  let xPos = event.x - handleRadius;
  xPos = Math.max(0, Math.min(xPos, sliderWidth));
  setPosition(xPos);
  const date =
    new Date(data[0].date).getTime() +
    (xPos / sliderWidth) *
      (new Date(data[data.length - 1].date).getTime() -
        new Date(data[0].date).getTime());
  const closestDate = data.reduce((prev, curr) =>
    Math.abs(new Date(curr.date).getTime() - date) <
    Math.abs(new Date(prev.date).getTime() - date)
      ? curr
      : prev
  ).date;
  selectDate("dateSelected", closestDate);
}

export function handleDragEnd(): void {
  // Logic for handleDragEnd if needed
}

export function updateSliderWidth(params: {
  timeline: HTMLElement;
  handleRadius: number;
  setSliderWidth: (width: number) => void;
}): void {
  const { timeline, handleRadius, setSliderWidth } = params;
  const width = timeline.clientWidth - handleRadius * 2 - 80;
  setSliderWidth(width);
}

export function startAutoSlide(params: {
  data: TimelineData[];
  positionSetter: (value: number) => void;
  positionGetter: () => number;
  sliderWidth: number;
  speed: number;
  selectDate: SelectDateFunction;
  setPlayingState: (playing: boolean) => void;
  animationFrameRef: { current: number };
}): void {
  const {
    data,
    positionSetter,
    positionGetter,
    sliderWidth,
    speed,
    selectDate,
    setPlayingState,
    animationFrameRef,
  } = params;
  function slide(): void {
    let currentXPos: number = positionGetter();
    if (currentXPos > sliderWidth) {
      setPlayingState(false);
      cancelAnimationFrame(animationFrameRef.current);
      return;
    }
    positionSetter(currentXPos + speed);
    const dateTimestamp =
      new Date(data[0].date).getTime() +
      (currentXPos / sliderWidth) *
        (new Date(data[data.length - 1].date).getTime() -
          new Date(data[0].date).getTime());
    const closestDate = data.reduce((prev, curr) =>
      Math.abs(new Date(curr.date).getTime() - dateTimestamp) <
      Math.abs(new Date(prev.date).getTime() - dateTimestamp)
        ? curr
        : prev
    ).date;
    selectDate("dateSelected", closestDate);
    animationFrameRef.current = requestAnimationFrame(slide);
  }
  slide();
}

export function rewind(params: {
  positionSetter: (value: number) => void;
  data: TimelineData[];
  selectDate: SelectDateFunction;
}): void {
  const { positionSetter, data, selectDate } = params;
  positionSetter(0);
  selectDate("dateSelected", data[0].date);
}

export function initializeTimeline(params: InitD3TimelineParams): void {
  if (params.timeline) {
    initD3Timeline(params);
  }
}
