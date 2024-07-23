<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import ResizeObserver from "resize-observer-polyfill";
  import {
    updatePlayPauseButton,
    handleDrag,
    handleDragEnd,
    updateSliderWidth,
    startAutoSlide,
    rewind as rewindTimeline,
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
    try {
      initializeTimeline({
        timeline,
        data,
        handleRadius,
        sliderWidth,
        isPlaying,
        togglePlay,
        rewind: () => {
          rewindTimeline({
            positionSetter: (value: number) => {
              position = value;
              updateHandlePosition();
            },
            data,
            selectDate,
          });
        },
        selectDate,
        speed,
        handleDrag: (event) =>
          handleDrag(
            event,
            handleRadius,
            sliderWidth,
            (value) => {
              position = value;
              updateHandlePosition();
            },
            data,
            selectDate
          ),
        handleDragEnd,
      });

      resizeObserver = new ResizeObserver(() => {
        if (timeline) {
          updateSliderWidth({
            timeline,
            handleRadius,
            setSliderWidth,
          });
        }
      });

      if (timeline) {
        resizeObserver.observe(timeline);
      }
    } catch (error) {
      console.error("Error initializing timeline:", error);
    }
  });

  onDestroy(() => {
    resizeObserver.disconnect();
    cancelAnimationFrame(animationFrameRef.current);
  });

  function setSliderWidth(width: number): void {
    sliderWidth = width;
    try {
      initializeTimeline({
        timeline,
        data,
        handleRadius,
        sliderWidth,
        isPlaying,
        togglePlay,
        rewind: () => {
          rewindTimeline({
            positionSetter: (value: number) => {
              position = value;
              updateHandlePosition();
            },
            data,
            selectDate,
          });
        },
        selectDate,
        speed,
        handleDrag: (event) =>
          handleDrag(
            event,
            handleRadius,
            sliderWidth,
            (value) => {
              position = value;
              updateHandlePosition();
            },
            data,
            selectDate
          ),
        handleDragEnd,
      });
    } catch (error) {
      console.error("Error setting slider width:", error);
    }
  }

  function updateHandlePosition() {
    if (timeline) {
      d3.select(timeline)
        .select("circle")
        .attr("cx", position + handleRadius);
    }
  }

  function togglePlay(): void {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startAutoSlide({
        data,
        positionSetter: (value: number) => {
          position = value;
          updateHandlePosition();
        },
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
