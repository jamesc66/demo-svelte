<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import ResizeObserver from "resize-observer-polyfill";
  import {
    updatePlayPauseButton,
    handleDrag,
    handleDragEnd,
    updateSliderWidth,
    startAutoSlide,
    rewind,
    initializeTimeline,
    type TimelineData,
  } from "./timeline";
  import * as d3 from "d3";

  export let data: TimelineData[];
  export let speed: number = 5;

  const dispatch = createEventDispatcher();
  const selectDate = (type: string, detail: any) => {
    dispatch(type, detail);
  };

  let timeline: HTMLDivElement | null = null;
  let sliderWidth: number = 0;
  let isPlaying: boolean = false;
  let animationFrameRef = { current: 0 };
  let resizeObserver: ResizeObserver;
  const handleRadius: number = 5;
  let position: number = 0;

  onMount(() => {
    initializeTimeline({
      timeline,
      data,
      handleRadius,
      sliderWidth,
      isPlaying,
      togglePlay,
      rewind: () =>
        rewind({
          positionSetter: (value: number) => (position = value),
          data,
          selectDate,
        }),
      selectDate,
      speed,
      handleDrag: (event) =>
        handleDrag(
          event,
          handleRadius,
          sliderWidth,
          (value) => {
            position = value;
            if (timeline) {
              d3.select(timeline)
                .select("circle")
                .attr("cx", position + handleRadius);
            }
          },
          data,
          selectDate
        ),
      handleDragEnd,
    });

    resizeObserver = new ResizeObserver(() => {
      if (timeline) {
        updateSliderWidth({
          sliderWidth,
          timeline,
          handleRadius,
          setSliderWidth,
        });
      }
    });

    if (timeline) {
      resizeObserver.observe(timeline);
    }
  });

  onDestroy(() => {
    resizeObserver.disconnect();
    cancelAnimationFrame(animationFrameRef.current);
  });
  function setSliderWidth(width: number): void {
    console.log("Setting slider width:", width); // Debugging
    sliderWidth = width;
    initializeTimeline({
      timeline,
      data,
      handleRadius,
      sliderWidth,
      isPlaying,
      togglePlay,
      rewind: () =>
        rewind({
          positionSetter: (value: number) => (position = value),
          data,
          selectDate,
        }),
      selectDate,
      speed,
      handleDrag: (event) =>
        handleDrag(
          event,
          handleRadius,
          sliderWidth,
          (value) => {
            position = value;
            if (timeline) {
              d3.select(timeline)
                .select("circle")
                .attr("cx", position + handleRadius);
            }
          },
          data,
          selectDate
        ),
      handleDragEnd,
    });
  }

  function togglePlay(): void {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startAutoSlide({
        data,
        positionSetter: (value: number) => (position = value),
        positionGetter: () => position,
        sliderWidth,
        speed,
        selectDate,
        setPlayingState: (playing: boolean) => {
          isPlaying = playing;
        },
        animationFrameRef,
      });
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (timeline) {
      updatePlayPauseButton({ timeline, isPlaying });
    }
  }
</script>

<div class="timeline" bind:this={timeline}></div>
