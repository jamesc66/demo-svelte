<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import ResizeObserver from "resize-observer-polyfill";
  import {
    updatePlayPauseButton,
    handleDrag as importedHandleDrag,
    handleDragEnd,
    updateSliderWidth,
    startAutoSlide,
    rewind,
    initializeTimeline,
    type TimelineData,
  } from "./timeline";

  // Change the type of data to be an array of TimelineData
  export let data: TimelineData[];
  export let speed: number = 5;

  const dispatch = createEventDispatcher();
  const position = tweened(0, { duration: 300, easing: cubicOut });

  let timeline: HTMLDivElement | null = null;
  let sliderWidth: number = 0;
  let isPlaying: boolean = false;
  let animationFrameRef = { current: 0 }; // Reference object to hold the animation frame
  let resizeObserver: ResizeObserver;
  const handleRadius: number = 5;

  onMount(() => {
    initializeTimeline({
      timeline,
      data, // Pass data directly
      position: {
        set: (value: number) => position.set(value),
        subscribe: position.subscribe,
      },
      handleRadius,
      sliderWidth,
      isPlaying,
      togglePlay,
      rewind: () =>
        rewind({
          positionSetter: (value: number) => position.set(value),
          data,
          dispatch,
        }),
      dispatch,
      speed,
      handleDrag: (params) => handleDrag(params),
      handleDragEnd,
    });

    resizeObserver = new ResizeObserver(() => {
      if (timeline) {
        updateSliderWidth({ timeline, handleRadius, setSliderWidth });
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
    sliderWidth = width;
    initializeTimeline({
      timeline,
      data, // Pass data directly
      position: {
        set: (value: number) => position.set(value),
        subscribe: position.subscribe,
      },
      handleRadius,
      sliderWidth,
      isPlaying,
      togglePlay,
      rewind: () =>
        rewind({
          positionSetter: (value: number) => position.set(value),
          data,
          dispatch,
        }),
      dispatch,
      speed,
      handleDrag: (params) => handleDrag(params),
      handleDragEnd,
    });
  }

  function togglePlay(): void {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startAutoSlide({
        data, // Pass data directly
        positionSetter: (value: number) => position.set(value),
        positionGetter: () => {
          let currentXPos: number = 0;
          position.subscribe((value: number) => {
            currentXPos = value;
          })();
          return currentXPos;
        },
        sliderWidth,
        speed,
        dispatch,
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

  function handleDrag(event: any): void {
    importedHandleDrag({
      event,
      handleRadius,
      sliderWidth,
      position,
      data, // Pass data directly
      dispatch,
    });
  }
</script>

<div class="timeline" bind:this={timeline}></div>
