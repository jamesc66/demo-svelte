import * as d3 from 'd3';
export interface XYConfig {
  variant: string;
  nKey: string;
  xKey: string;
  yKey: string;
  xAnnotations?: { x: Date; label: string; color: string }[];
  yAnnotations?: { y: number; label: string; color: string }[];
  dKey: string;
  ticks: number;
  lineWidth: number;
  pointWidth: number;
  show: string[];
  defaultFeatures: string[];
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width: number;
  height: number;
  enableZoom: 'x' | 'y' | 'xy';
  colors: string[];
  fullWidth: boolean;
  timeFormat?: string; // Optional timeFormat property
}

interface DataEntry {
  [key: string]: any;
}

interface Series {
  [key: string]: any;
  dKey: DataEntry[];
}

interface GraphParamsBase {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Series[];
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  color: d3.ScaleOrdinal<string, unknown>;
  selectedSeries: Set<string>;
  nKey: string;
  xKey: string;
  yKey: string;
  dKey: string;
  newScales?: {
    x: d3.ScaleTime<number, number>;
    y: d3.ScaleLinear<number, number>;
  };
}

interface GridAndAxesParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  width: number;
  height: number;
  ticks: number;
  timeFormat: string;
}

interface AddLegendParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Series[];
  width: number;
  color: d3.ScaleOrdinal<string, unknown>;
  selectedSeries: Set<string>;
  toggleSeries: (nKey: string) => void;
  nKey: string;
}

interface UseScalesParams {
  data: Series[];
  width: number;
  height: number;
  xKey: string;
  yKey: string;
  dKey: string;
}

interface UseColorsParams {
  colors: string[];
  series: string[];
}

interface InitializeShowParams {
  defaultFeatures: string[];
}

export interface Annotation {
  x?: Date;
  y?: number;
  label: string;
  color: string;
}

interface AddAnnotationsParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  height: number;
  width: number;
  xAnnotations: Annotation[];
  yAnnotations: Annotation[];
  newScales?: {
    x: d3.ScaleTime<number, number>;
    y: d3.ScaleLinear<number, number>;
  };
}

interface InitializeXYElementsParams extends GraphParamsBase {
  graphGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  show: { [key: string]: boolean };
  width: number;
  height: number;
  lineWidth: number;
  pointWidth: number;
  ticks: number;
  timeFormat: string;
  xAnnotations: Annotation[];
  yAnnotations: Annotation[];
}

interface UseZoomParams {
  svgElement: SVGSVGElement;
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  width: number;
  height: number;
  show: { [key: string]: boolean };
  data: Series[];
  color: d3.ScaleOrdinal<string, unknown>;
  selectedSeries: Set<string>;
  ticks: number;
  lineWidth: number;
  pointWidth: number;
  nKey: string;
  xKey: string;
  yKey: string;
  dKey: string;
  timeFormat: string;
  xAnnotations: Annotation[];
  yAnnotations: Annotation[];
  enableZoom: 'x' | 'y' | 'xy'; // Updated to match new type
}

export function parseDate(dateStr: string): Date | null {
  return d3.isoParse(dateStr);
}

export function createSvg(
  svgElement: SVGSVGElement,
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
  fullWidth: boolean
): d3.Selection<SVGGElement, unknown, null, undefined> {
  const svg = d3.select(svgElement);

  if (fullWidth) {
    svg
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom);
  } else {
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
  }

  const g = svg
    .append<SVGGElement>('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  g.append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

  return g;
}

export function addGridLines({
  svg,
  x,
  y,
  width,
  height,
  ticks,
}: GridAndAxesParams): void {
  const xAxis = d3
    .axisBottom(x)
    .ticks(ticks)
    .tickSize(-height)
    .tickFormat(null);
  const yAxis = d3.axisLeft(y).ticks(ticks).tickSize(-width).tickFormat(null);

  svg
    .append('g')
    .attr('class', 'grid x-grid')
    .attr('color', 'lightgray')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis as any);

  svg
    .append('g')
    .attr('class', 'grid y-grid')
    .attr('color', 'lightgray')
    .call(yAxis as any);
}

export function addAxes({
  svg,
  x,
  y,
  height,
  ticks,
  timeFormat,
}: GridAndAxesParams): void {
  const xAxis = d3
    .axisBottom(x)
    .ticks(ticks)
    .tickFormat(d => d3.timeFormat(timeFormat || '%d/%m/%Y')(d as Date)); // Ensure TypeScript knows 'd' is a Date

  const yAxis = d3.axisLeft(y);

  const xAxisGroup = svg
    .append<SVGGElement>('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis as any); // Use 'any' to bypass the strict type check

  const yAxisGroup = svg
    .append<SVGGElement>('g')
    .attr('class', 'axis y-axis')
    .call(yAxis as any); // Use 'any' to bypass the strict type check

  xAxisGroup.selectAll('path').attr('stroke', '#4083b9');
  xAxisGroup.selectAll('line').attr('stroke', '#4083b9');
  yAxisGroup.selectAll('path').attr('stroke', '#4083b9');
  yAxisGroup.selectAll('line').attr('stroke', '#4083b9');

  xAxisGroup.selectAll('text').attr('fill', '#000000');
  yAxisGroup.selectAll('text').attr('fill', '#000000');
}

function groupAnnotations(
  annotations: Annotation[],
  scale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>,
  threshold: number
): {
  position: number;
  count: number;
  label: string;
  color: string;
  additionalPositions: number[];
}[] {
  annotations.sort((a, b) => scale(a.x || a.y!) - scale(b.x || b.y!));

  const groupedAnnotations: {
    position: number;
    count: number;
    label: string;
    color: string;
    additionalPositions: number[];
  }[] = [];
  let currentGroup: Annotation[] = [];
  let currentPosition = scale(annotations[0].x || annotations[0].y!);

  annotations.forEach(annotation => {
    const position = scale(annotation.x || annotation.y!);

    if (Math.abs(position - currentPosition) <= threshold) {
      currentGroup.push(annotation);
    } else {
      groupedAnnotations.push({
        position: currentPosition,
        count: currentGroup.length,
        label:
          currentGroup.length > 1
            ? `${currentGroup.length - 0} inc ${currentGroup[0].label}`
            : currentGroup[0].label || '',
        color: currentGroup[0].color || 'black',
        additionalPositions: currentGroup.slice(1).map(a => scale(a.x || a.y!)),
      });
      currentGroup = [annotation];
      currentPosition = position;
    }
  });

  if (currentGroup.length > 0) {
    groupedAnnotations.push({
      position: currentPosition,
      count: currentGroup.length,
      label:
        currentGroup.length > 1
          ? `${currentGroup.length - 0} inc ${currentGroup[0].label}`
          : currentGroup[0].label || '',
      color: currentGroup[0].color || 'black',
      additionalPositions: currentGroup.slice(1).map(a => scale(a.x || a.y!)),
    });
  }

  return groupedAnnotations;
}

export function addLines(
  params: GraphParamsBase & { lineWidth: number }
): void {
  const {
    svg,
    data,
    x,
    y,
    color,
    selectedSeries,
    lineWidth,
    nKey,
    xKey,
    yKey,
    dKey,
    newScales,
  } = params;
  const xScale = newScales?.x ?? x;
  const yScale = newScales?.y ?? y;

  data.forEach((series, index) => {
    if (selectedSeries.has(series[nKey])) {
      const line = d3
        .line<DataEntry>()
        .x((d: DataEntry) => xScale(parseDate(d[xKey])!))
        .y((d: DataEntry) => yScale(d[yKey]));

      const path = svg.select(`.line.series-${index}`);
      if (path.empty()) {
        svg
          .append('path')
          .datum(series[dKey])
          .attr('class', `line series-${index}`)
          .attr('fill', 'none')
          .attr('stroke', color(`${index}`) as string)
          .attr('stroke-width', lineWidth || 1.5)
          .attr('d', line(series[dKey])); // Call the line generator with the data
      } else {
        path.attr('d', line(series[dKey])); // Call the line generator with the data
      }
    }
  });
}

export function addRoundedLines(
  params: GraphParamsBase & { lineWidth: number }
): void {
  const {
    svg,
    data,
    x,
    y,
    color,
    selectedSeries,
    lineWidth,
    nKey,
    xKey,
    yKey,
    dKey,
    newScales,
  } = params;
  const xScale = newScales?.x ?? x;
  const yScale = newScales?.y ?? y;

  data.forEach((series, index) => {
    if (selectedSeries.has(series[nKey])) {
      const line = d3
        .line<DataEntry>()
        .x((d: DataEntry) => xScale(parseDate(d[xKey])!))
        .y((d: DataEntry) => yScale(d[yKey]))
        .curve(d3.curveBasis); // Use d3.curveBasis to create rounded lines

      const path = svg.select(`.rounded-line.series-${index}`);
      if (path.empty()) {
        svg
          .append('path')
          .datum(series[dKey])
          .attr('class', `rounded-line series-${index}`)
          .attr('fill', 'none')
          .attr('stroke', color(`${index}`) as string)
          .attr('stroke-width', lineWidth || 1.5)
          .attr('d', line(series[dKey])); // Call the line generator with the data
      } else {
        path.attr('d', line(series[dKey])); // Call the line generator with the data
      }
    }
  });
}

export function addAreas(params: GraphParamsBase): void {
  const {
    svg,
    data,
    x,
    y,
    color,
    selectedSeries,
    nKey,
    xKey,
    yKey,
    dKey,
    newScales,
  } = params;
  const xScale = newScales?.x ?? x;
  const yScale = newScales?.y ?? y;

  data.forEach((series, index) => {
    if (selectedSeries.has(series[nKey])) {
      const area = d3
        .area<DataEntry>()
        .x((d: DataEntry) => xScale(parseDate(d[xKey])!))
        .y0(yScale(0))
        .y1((d: DataEntry) => yScale(d[yKey]));

      const path = svg.select(`.area.series-${index}`);
      if (path.empty()) {
        svg
          .append('path')
          .datum(series[dKey])
          .attr('class', `area series-${index}`)
          .attr('fill', color(`${index}`) as string)
          .attr('opacity', 0.3)
          .attr('d', area(series[dKey])); // Call the area generator with the data
      } else {
        path.attr('d', area(series[dKey])); // Call the area generator with the data
      }
    }
  });
}

export function addPoints(
  params: GraphParamsBase & { pointRadius: number }
): void {
  const {
    svg,
    data,
    x,
    y,
    color,
    selectedSeries,
    pointRadius,
    nKey,
    xKey,
    yKey,
    dKey,
    newScales,
  } = params;
  const xScale = newScales?.x ?? x;
  const yScale = newScales?.y ?? y;

  data.forEach((series, index) => {
    if (selectedSeries.has(series[nKey])) {
      const points = svg.selectAll(`circle.series-${index}`).data(series[dKey]);

      points
        .enter()
        .append('circle')
        .attr('class', `point series-${index}`)
        .attr('cx', (d: any) => xScale(parseDate(d[xKey])!))
        .attr('cy', (d: any) => yScale(d[yKey]))
        .attr('r', pointRadius || 2)
        .attr('fill', color(`${index}`) as string);

      points
        .attr('cx', (d: any) => xScale(parseDate(d[xKey])!))
        .attr('cy', (d: any) => yScale(d[yKey]));
    }
  });
}

export function addToggles(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  show: { [key: string]: boolean },
  toggleShow: (option: string) => void
): void {
  const toggleContainer = svg
    .append('g')
    .attr('class', 'toggles')
    .attr('transform', 'translate(0, 0)');

  Object.keys(show).forEach((option, index) => {
    toggleItem(toggleContainer, option, index, show, toggleShow);
  });
}

export function toggleItem(
  toggleContainer: d3.Selection<SVGGElement, unknown, null, undefined>,
  option: string,
  index: number,
  show: { [key: string]: boolean },
  toggleShow: (option: string) => void
): void {
  const toggleItem = toggleContainer
    .append('g')
    .attr('class', 'toggle-item')
    .attr('transform', `translate(0, ${index * 25})`) // Adjusted spacing for uniform size
    .style('cursor', 'pointer')
    .on('click', () => {
      toggleShow(option);
    });
  toggleItem
    .append('rect')
    .attr('width', 10) // Standardized size
    .attr('height', 10) // Standardized size
    .attr('x', 3) // Positioned at the start of the row
    .attr('y', 2) // Centered vertically in the 25px height
    .attr('fill', show[option] ? '#7597c9' : 'white')
    .attr('stroke', '#7597c9')
    .attr('stroke-width', 2);

  toggleItem
    .append('text')
    .attr('x', 22) // Standardized spacing
    .attr('y', 12) // Adjusted for alignment
    .style('font-size', '14px') // Standardized font size
    .attr('text-anchor', 'start')
    .style('text-transform', 'capitalize')
    .text(option);
}

export function addLegend(params: any): void {
  const { svg, data } = params;
  const legend = svg.append('g').attr('transform', 'translate(0, 0)');

  data.forEach((series, index) => {
    legendItem(legend, series, index, params);
  });
}

export function legendItem(
  legend: any,
  series: any,
  index: number,
  params: any
): void {
  const { color, selectedSeries, toggleSeries, nKey } = params;
  const legendRow = legend
    .append('g')
    .attr('transform', `translate(0, ${index * 25})`) // Adjusted spacing for uniform size
    .style('cursor', 'pointer')
    .on('click', () => {
      toggleSeries(series[nKey]);
    });
  legendRow
    .append('circle') // Changed from 'rect' to 'circle'
    .attr('cx', 8) // Center x of the circle
    .attr('cy', 8) // Center y of the circle
    .attr('r', 5) // Reduced radius for smaller circles
    .attr(
      'fill',
      selectedSeries.has(series[nKey]) ? color(series[nKey]) : 'white'
    )
    .style('stroke', color(series[nKey]))
    .style('stroke-width', 2);

  legendRow
    .append('text')
    .attr('x', 22) // Standardized spacing
    .attr('y', 12) // Adjusted for alignment
    .style('font-size', '14px') // Standardized font size
    .attr('text-anchor', 'start')
    .style('text-transform', 'capitalize')
    .text(series[nKey]);
}

export function initializeShow({ defaultFeatures }: InitializeShowParams): {
  [key: string]: boolean;
} {
  const features = [
    'grid',
    'axis',
    'areas',
    'lines',
    'points',
    'heat',
    'rounded-lines',
    'annotations',
  ];
  const show: { [key: string]: boolean } = {};

  features.forEach(feature => {
    show[feature] = defaultFeatures.includes(feature);
  });

  return show;
}

export function useScales(params: UseScalesParams): {
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
} {
  const { data, width, height, xKey, yKey, dKey } = params;
  console.log('useScales params:', params);

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('Data is not valid');
  }

  const allValues = data.flatMap(series => series[dKey]);

  if (!allValues || allValues.length === 0) {
    throw new Error('Data entries are not valid');
  }

  const x = d3
    .scaleTime()
    .domain(
      d3.extent(allValues, (d: any) => parseDate(d[xKey])!) as [Date, Date]
    )
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(allValues, (d: any) => d[yKey])!])
    .range([height, 0]);

  return { x, y };
}

export function useColors(params: UseColorsParams): {
  color: d3.ScaleOrdinal<string, unknown>;
} {
  const { colors, series } = params;
  const color = d3.scaleOrdinal<string, unknown>(colors);
  color.domain(series); // Ensure the color scale has the correct domain
  return { color };
}

export function addAnnotations({
  svg,
  x,
  y,
  height,
  width,
  xAnnotations,
  yAnnotations,
  newScales,
}: AddAnnotationsParams): void {
  const fontSize = '11px';
  const xScale = newScales?.x ?? x;
  const yScale = newScales?.y ?? y;
  const threshold = 16; // threshold distance to group annotations

  // Remove existing annotations
  svg.selectAll('.annotation').remove();

  const groupedXAnnotations = groupAnnotations(xAnnotations, xScale, threshold);
  groupedXAnnotations.forEach(annotation => {
    const xPos = annotation.position;
    const forkHeight = height - 10; // Height where the fork lines will start
    const forkXPositions = annotation.additionalPositions;

    // Main line reaching the bottom
    svg
      .append('line')
      .attr('class', 'annotation x-annotation')
      .attr('x1', xPos)
      .attr('x2', xPos)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', annotation.color)
      .attr('stroke-width', forkXPositions.length > 0 ? 2 : 1);

    // Fork lines starting from forkHeight
    forkXPositions.forEach(additionalPos => {
      svg
        .append('line')
        .attr('class', 'annotation x-annotation-fork')
        .attr('x1', additionalPos)
        .attr('x2', additionalPos)
        .attr('y1', forkHeight)
        .attr('y2', height)
        .attr('stroke', annotation.color)
        .attr('stroke-width', 1);
    });

    // Bridging the tips of the forked lines to the main line
    if (forkXPositions.length > 0) {
      const minX = d3.min(forkXPositions);
      const maxX = d3.max(forkXPositions);
      if (minX !== undefined && maxX !== undefined) {
        // Bridge line from the first fork to the main line
        svg
          .append('line')
          .attr('class', 'annotation x-annotation-bridge')
          .attr('x1', minX)
          .attr('x2', xPos)
          .attr('y1', forkHeight)
          .attr('y2', forkHeight)
          .attr('stroke', annotation.color)
          .attr('stroke-width', 1);

        // Bridge line from the main line to the last fork
        svg
          .append('line')
          .attr('class', 'annotation x-annotation-bridge')
          .attr('x1', xPos)
          .attr('x2', maxX)
          .attr('y1', forkHeight)
          .attr('y2', forkHeight)
          .attr('stroke', annotation.color)
          .attr('stroke-width', 1);
      }
    }

    svg
      .append('text')
      .attr('class', 'annotation x-annotation-label')
      .attr('x', xPos + 5)
      .attr('y', 15)
      .text(annotation.label)
      .attr('fill', annotation.color)
      .attr('transform', `rotate(90, ${xPos + 5}, 15)`)
      .attr('font-size', fontSize)
      .style('cursor', 'pointer')
      .on('click', () => {
        console.log(
          'Annotation clicked:',
          annotation,
          'Children:',
          forkXPositions
        );
      }); // Log the annotation and its children when clicked
  });

  const groupedYAnnotations = groupAnnotations(yAnnotations, yScale, threshold);
  groupedYAnnotations.forEach(annotation => {
    const yPos = annotation.position;
    const forkWidth = width - 10; // Width where the fork lines will start

    // Main line reaching the right edge
    svg
      .append('line')
      .attr('class', 'annotation y-annotation')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yPos)
      .attr('y2', yPos)
      .attr('stroke', annotation.color)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,2');

    const forkYPositions = annotation.additionalPositions;

    // Fork lines starting from forkWidth
    forkYPositions.forEach(additionalPos => {
      svg
        .append('line')
        .attr('class', 'annotation y-annotation-fork')
        .attr('x1', forkWidth)
        .attr('x2', width)
        .attr('y1', yPos)
        .attr('y2', additionalPos)
        .attr('stroke', annotation.color)
        .attr('stroke-width', 1);
    });

    // Bridging the tips of the forked lines to the main line
    if (forkYPositions.length > 0) {
      const minY = d3.min(forkYPositions);
      const maxY = d3.max(forkYPositions);
      if (minY !== undefined && maxY !== undefined) {
        // Bridge line from the first fork to the main line
        svg
          .append('line')
          .attr('class', 'annotation y-annotation-bridge')
          .attr('x1', forkWidth)
          .attr('x2', width)
          .attr('y1', minY)
          .attr('y2', yPos)
          .attr('stroke', annotation.color)
          .attr('stroke-width', 1);

        // Bridge line from the main line to the last fork
        svg
          .append('line')
          .attr('class', 'annotation y-annotation-bridge')
          .attr('x1', forkWidth)
          .attr('x2', width)
          .attr('y1', yPos)
          .attr('y2', maxY)
          .attr('stroke', annotation.color)
          .attr('stroke-width', 1);
      }
    }

    svg
      .append('text')
      .attr('class', 'annotation y-annotation-label')
      .attr('x', 5)
      .attr('y', yPos - 5)
      .text(annotation.label)
      .attr('fill', annotation.color)
      .attr('font-size', fontSize)
      .style('cursor', 'pointer')
      .on('click', () => {
        console.log(
          'Annotation clicked:',
          annotation,
          'Children:',
          forkYPositions
        );
      }); // Log the annotation and its children when clicked
  });
}

export function useZoom(params: UseZoomParams): void {
  const {
    svgElement,
    x,
    y,
    width,
    height,
    show,
    data,
    color,
    selectedSeries,
    ticks,
    lineWidth,
    pointWidth,
    nKey,
    xKey,
    yKey,
    dKey,
    timeFormat,
    xAnnotations,
    yAnnotations,
  } = params;

  const zoomDirection = params.enableZoom || 'xy';

  const zoom: d3.ZoomBehavior<SVGSVGElement, unknown> = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([1, 8])
    .extent([
      [0, 0],
      [width, height],
    ])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on('zoom', zoomed);

  d3.select<SVGSVGElement, unknown>(svgElement).call(zoom);

  function zoomed(event: any): void {
    const transform = event.transform;

    const newX = zoomDirection.includes('x') ? transform.rescaleX(x) : x;
    const newY = zoomDirection.includes('y') ? transform.rescaleY(y) : y;

    constrainDomain(newX, x);
    constrainDomain(newY, y);

    if (show['grid']) updateGrid(newX, newY);
    if (show['axis']) updateAxes(newX, newY, timeFormat);
    const newScales = { x: newX, y: newY };
    updateGraphElements(newScales);
  }

  function constrainDomain(newScale: any, originalScale: any): void {
    const [newMin, newMax] = newScale.domain();
    const [originalMin, originalMax] = originalScale.domain();

    if (newMin < originalMin) {
      newScale.domain([originalMin, newMax - (newMin - originalMin)]);
    }
    if (newMax > originalMax) {
      newScale.domain([newMin - (newMax - originalMax), originalMax]);
    }
  }

  function updateGrid(newX: any, newY: any): void {
    d3.select(svgElement)
      .select('.x-grid')
      .call(
        d3
          .axisBottom(newX)
          .ticks(ticks)
          .tickSize(-height)
          .tickFormat(null) as any
      );
    d3.select(svgElement)
      .select('.y-grid')
      .call(
        d3.axisLeft(newY).ticks(ticks).tickSize(-width).tickFormat(null) as any
      );
  }

  function updateAxes(
    newX: any,
    newY: any,
    timeFormat: string = '%d/%m/%Y'
  ): void {
    d3.select(svgElement)
      .select('.x-axis')
      .call(
        d3
          .axisBottom(newX)
          .ticks(ticks)
          .tickFormat(d => d3.timeFormat(timeFormat)(d as Date)) as any
      ); // Ensure TypeScript knows 'd' is a Date
    d3.select(svgElement)
      .select('.y-axis')
      .call(d3.axisLeft(newY).ticks(ticks) as any); // Use 'any' to bypass the strict type check
  }

  function updateGraphElements(newScales: {
    x: d3.ScaleTime<number, number>;
    y: d3.ScaleLinear<number, number>;
  }): void {
    const graphGroup = d3.select(svgElement).select<SVGGElement>('g');

    if (show['areas'])
      addAreas({
        svg: graphGroup,
        data,
        x,
        y,
        color,
        selectedSeries,
        nKey,
        xKey,
        yKey,
        dKey,
        newScales,
      });
    if (show['lines'])
      addLines({
        svg: graphGroup,
        data,
        x,
        y,
        color,
        selectedSeries,
        lineWidth,
        nKey,
        xKey,
        yKey,
        dKey,
        newScales,
      });
    if (show['rounded-lines'])
      addRoundedLines({
        svg: graphGroup,
        data,
        x,
        y,
        color,
        selectedSeries,
        lineWidth,
        nKey,
        xKey,
        yKey,
        dKey,
        newScales,
      });
    if (show['points'])
      addPoints({
        svg: graphGroup,
        data,
        x,
        y,
        color,
        selectedSeries,
        pointRadius: pointWidth,
        nKey,
        xKey,
        yKey,
        dKey,
        newScales,
      });
    if (show['annotations'])
      addAnnotations({
        svg: graphGroup,
        x: newScales.x,
        y: newScales.y,
        height,
        width,
        xAnnotations,
        yAnnotations,
        newScales,
      });
  }
}

export function initializeXYElements(params: InitializeXYElementsParams): void {
  const {
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
    lineWidth,
    pointWidth,
    nKey,
    xKey,
    yKey,
    dKey,
    ticks,
    timeFormat,
    xAnnotations,
    yAnnotations,
  } = params;

  if (show['grid'])
    addGridLines({ svg, x, y, width, height, ticks, timeFormat });
  if (show['axis']) addAxes({ svg, x, y, height, ticks, width, timeFormat });
  if (show['areas'])
    addAreas({
      svg: graphGroup,
      data,
      x,
      y,
      color,
      selectedSeries,
      nKey,
      xKey,
      yKey,
      dKey,
    });
  if (show['lines'])
    addLines({
      svg: graphGroup,
      data,
      x,
      y,
      color,
      selectedSeries,
      lineWidth,
      nKey,
      xKey,
      yKey,
      dKey,
    });
  if (show['points'])
    addPoints({
      svg: graphGroup,
      data,
      x,
      y,
      color,
      selectedSeries,
      pointRadius: pointWidth,
      nKey,
      xKey,
      yKey,
      dKey,
    });
  if (show['rounded-lines'])
    addRoundedLines({
      svg: graphGroup,
      data,
      x,
      y,
      color,
      selectedSeries,
      lineWidth,
      nKey,
      xKey,
      yKey,
      dKey,
    });
  if (show['annotations'])
    addAnnotations({
      svg: graphGroup,
      x,
      y,
      height,
      width,
      xAnnotations,
      yAnnotations,
    });
}
