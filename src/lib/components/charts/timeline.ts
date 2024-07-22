// timeline.ts
import * as d3 from "d3";

export interface Position {
  subscribe(callback: (value: number) => void): void;
  set(value: number): void;
}

export interface TimelineData {
  date: string;
  insight: Insight[];
}

export interface Insight {
  room: string;
  insight: string;
  value: number;
}

export type DispatchFunction = (type: string, detail?: any) => void;

export interface InitD3TimelineParams {
  timeline: HTMLDivElement | null;
  data: TimelineData[];
  position: Position;
  handleRadius: number;
  sliderWidth: number;
  isPlaying: boolean;
  togglePlay: () => void;
  rewind: () => void;
  dispatch: DispatchFunction;
  speed: number;
  handleDrag: (params: HandleDragParams) => void;
  handleDragEnd: () => void;
}

// Export all other necessary interfaces and functions as well

export interface HandleDragParams {
  event: any;
  handleRadius: number;
  sliderWidth: number;
  position: Position;
  data: TimelineData[];
  dispatch: DispatchFunction;
}

export interface CreatePlayPauseButtonParams {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  isPlaying: boolean;
  togglePlay: () => void;
}

export interface CreatePlayPauseRectsParams {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  isPlaying: boolean;
}

export interface CreatePlayPausePolygonParams {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  isPlaying: boolean;
}

export interface CreateSliderParams {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  handleRadius: number;
  sliderWidth: number;
  position: Position;
  handleDrag: (params: HandleDragParams) => void;
  handleDragEnd: () => void;
}

export interface CreateSliderLineParams {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  handleRadius: number;
  sliderWidth: number;
}

export interface CreateSliderHandleParams {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  handleRadius: number;
  position: Position;
  handleDrag: (params: HandleDragParams) => void;
  handleDragEnd: () => void;
}

export interface CreateRewindButtonParams {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  rewind: () => void;
}

export interface CreateNumOfDaysTextParams {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  numOfDays: number;
}

export interface UpdatePlayPauseButtonParams {
  timeline: HTMLElement;
  isPlaying: boolean;
}

export interface UpdateNumOfDaysTextParams {
  timeline: HTMLElement;
  numOfDays: number;
}

export interface UpdateSliderWidthParams {
  timeline: HTMLElement;
  handleRadius: number;
  setSliderWidth: (width: number) => void;
}

export interface StartAutoSlideParams {
  data: TimelineData[];
  positionSetter: (value: number) => void;
  positionGetter: () => number;
  sliderWidth: number;
  speed: number;
  dispatch: DispatchFunction;
  setPlayingState: (playing: boolean) => void;
  animationFrameRef: { current: number };
}

export interface RewindParams {
  positionSetter: (value: number) => void;
  data: TimelineData[];
  dispatch: DispatchFunction;
}

// Utility function to calculate number of days
export function calculateNumOfDays(data: TimelineData[]): number {
  const startDate = new Date(data[0].date);
  const endDate = new Date(data[data.length - 1].date);
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

// Create play/pause button
export function createPlayPauseButton(params: CreatePlayPauseButtonParams): void {
  const { container, isPlaying, togglePlay } = params;

  const playPauseButton = container
    .append<SVGSVGElement>("svg")
    .attr("width", 30)
    .attr("height", 40)
    .style("cursor", "pointer")
    .style("margin-right", "10px")
    .on("click", () => togglePlay());

  createPlayPauseRects({ svg: playPauseButton, isPlaying });
  createPlayPausePolygon({ svg: playPauseButton, isPlaying });
}

export function createPlayPauseRects(params: CreatePlayPauseRectsParams): void {
  const { svg, isPlaying } = params;

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

export function createPlayPausePolygon(params: CreatePlayPausePolygonParams): void {
  const { svg, isPlaying } = params;

  svg
    .append("polygon")
    .attr("points", "10,5 10,35 25,20")
    .attr("fill", "#7597C9")
    .attr("display", isPlaying ? "none" : "block");
}

// Create slider
export function createSlider(params: CreateSliderParams): void {
  const { container, handleRadius, sliderWidth, position, handleDrag, handleDragEnd } = params;

  const svg = container.append<SVGSVGElement>("svg").attr("width", "100%").attr("height", 40);

  createSliderLine({ svg, handleRadius, sliderWidth });
  createSliderHandle({ svg, handleRadius, position, handleDrag, handleDragEnd });
}

export function createSliderLine(params: CreateSliderLineParams): void {
  const { svg, handleRadius, sliderWidth } = params;

  svg
    .append("line")
    .attr("x1", handleRadius)
    .attr("y1", 20)
    .attr("x2", sliderWidth + handleRadius)
    .attr("y2", 20)
    .attr("stroke", "lightgray")
    .attr("stroke-width", 2);
}

export function createSliderHandle(params: CreateSliderHandleParams): void {
  const { svg, handleRadius, position, handleDrag, handleDragEnd } = params;

  const handle = svg
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
        .on("start", event => handleDrag({ event, handleRadius, sliderWidth: +svg.attr("width"), position, data: [], dispatch: () => {} }))
        .on("drag", event => handleDrag({ event, handleRadius, sliderWidth: +svg.attr("width"), position, data: [], dispatch: () => {} }))
        .on("end", handleDragEnd)
    );

  position.subscribe(value => {
    handle.attr("cx", value + handleRadius);
  });
}

// Create rewind button
export function createRewindButton(params: CreateRewindButtonParams): void {
  const { container, rewind } = params;

  const rewindButton = container
    .append<SVGSVGElement>("svg")
    .attr("width", 30)
    .attr("height", 40)
    .style("cursor", "pointer")
    .style("margin-left", "10px")
    .on("click", rewind);

  rewindButton
    .append<SVGPolygonElement>("polygon")
    .attr("points", "20,5 20,35 5,20")
    .attr("fill", "#7597C9");
}

// Create number of days text
export function createNumOfDaysText(params: CreateNumOfDaysTextParams): void {
  const { container, numOfDays } = params;

  container
    .append<HTMLDivElement>("div")
    .attr("class", "num-of-days-text")
    .style("text-align", "center")
    .style("margin-top", "10px")
    .style("font-size", "0.8rem")
    .text(`Last ${numOfDays} days`);
}

// Initialize D3 Timeline
export function initD3Timeline(params: InitD3TimelineParams): void {
  const { timeline, data, position, handleRadius, sliderWidth, isPlaying, togglePlay, rewind, dispatch, speed, handleDrag, handleDragEnd } = params;

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

  createPlayPauseButton({ container: controlsContainer, isPlaying, togglePlay });
  createSlider({
    container: controlsContainer,
    handleRadius,
    sliderWidth,
    position,
    handleDrag: (eventParams: HandleDragParams) => handleDrag({ ...eventParams, data, dispatch }),
    handleDragEnd
  });
  createRewindButton({ container: controlsContainer, rewind });
  createNumOfDaysText({ container, numOfDays: calculateNumOfDays(data) });
}

// Update play/pause button state
export function updatePlayPauseButton(params: UpdatePlayPauseButtonParams): void {
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

// Update number of days text
export function updateNumOfDaysText(params: UpdateNumOfDaysTextParams): void {
  const { timeline, numOfDays } = params;

  d3.select(timeline)
    .select<HTMLDivElement>(".num-of-days-text")
    .text(`Last ${numOfDays} days`);
}

// Handle drag events
export function handleDrag(params: HandleDragParams): void {
  const { event, handleRadius, sliderWidth, position, data, dispatch } = params;

  console.log('handleDrag:', { event, handleRadius, sliderWidth, position, data });

  if (!data || data.length === 0) {
    console.error('Data is not defined or empty');
    return;
  }

  let xPos = event.x - handleRadius;
  xPos = Math.max(0, Math.min(xPos, sliderWidth));

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

// Handle drag end events
export function handleDragEnd(): void {
  // Logic for handleDragEnd if needed
}

// Update slider width
export function updateSliderWidth(params: UpdateSliderWidthParams): void {
  const { timeline, handleRadius, setSliderWidth } = params;

  const width = timeline.clientWidth - handleRadius * 2 - 80;
  setSliderWidth(width);
}

// Start auto slide
export function startAutoSlide(params: StartAutoSlideParams): void {
  const {
    data,
    positionSetter,
    positionGetter,
    sliderWidth,
    speed,
    dispatch,
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
    const closestDate = data.reduce((prev, curr) => {
      return Math.abs(new Date(curr.date).getTime() - dateTimestamp) <
        Math.abs(new Date(prev.date).getTime() - dateTimestamp)
        ? curr
        : prev;
    }).date;

    dispatch("dateSelected", closestDate);

    animationFrameRef.current = requestAnimationFrame(slide);
  }
  slide();
}

// Rewind function
export function rewind(params: RewindParams): void {
  const { positionSetter, data, dispatch } = params;
  positionSetter(0);
  dispatch("dateSelected", data[0].date);
}

// Initialize timeline
export function initializeTimeline(params: InitD3TimelineParams): void {
  if (params.timeline) {
    initD3Timeline(params);
  }
}
