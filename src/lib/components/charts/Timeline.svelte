<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import ResizeObserver from "resize-observer-polyfill";
  import {
    initD3Timeline,
    updatePlayPauseButton,
    handleDrag,
    handleDragEnd,
    calculateNumOfDays,
  } from "./timeline";

  export let data: {
    date: string;
    insight: { room: string; insight: string; value: number }[];
  }[];

  export let speed = 5; // Speed of the auto slide

  const dispatch = createEventDispatcher();
  const position = tweened(0, { duration: 300, easing: cubicOut });

  let timeline;
  let sliderWidth = 0;
  let numOfDays = 0;
  let isPlaying = false;
  let animationFrame;
  let resizeObserver;
  let handleRadius = 5;

  onMount(() => {
    numOfDays = calculateNumOfDays(data);
    resizeObserver = new ResizeObserver(() =>
      updateSliderWidth(timeline, handleRadius, setSliderWidth)
    );
    resizeObserver.observe(timeline);
    initD3Timeline(
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
    );
  });

  onDestroy(() => {
    resizeObserver.disconnect();
    cancelAnimationFrame(animationFrame);
  });

  function setSliderWidth(width) {
    sliderWidth = width;
    initD3Timeline(
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
    );
  }

  function updateSliderWidth(timeline, handleRadius, setSliderWidth) {
    if (timeline) {
      const width = timeline.clientWidth - handleRadius * 2 - 80; // Adjusted for button width
      setSliderWidth(width);
    }
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startAutoSlide(
        data,
        position,
        sliderWidth,
        speed,
        dispatch,
        setPlayingState
      );
    } else {
      cancelAnimationFrame(animationFrame);
    }
    updatePlayPauseButton(timeline, isPlaying);
  }

  function setPlayingState(playing) {
    isPlaying = playing;
  }

  function startAutoSlide(
    data,
    position,
    sliderWidth,
    speed,
    dispatch,
    setPlayingState
  ) {
    function slide() {
      let currentXPos;
      position.subscribe((value) => (currentXPos = value))();
      if (currentXPos > sliderWidth) {
        setPlayingState(false);
        cancelAnimationFrame(animationFrame);
        return;
      }
      position.set(currentXPos + speed);

      const date =
        new Date(data[0].date).getTime() +
        (currentXPos / sliderWidth) *
          (new Date(data[data.length - 1].date).getTime() -
            new Date(data[0].date).getTime());
      const closestDate = data.reduce((prev, curr) => {
        return Math.abs(new Date(curr.date).getTime() - date) <
          Math.abs(new Date(prev.date).getTime() - date)
          ? curr
          : prev;
      }).date;

      dispatch("dateSelected", closestDate);

      animationFrame = requestAnimationFrame(slide);
    }
    slide();
  }

  function rewind() {
    position.set(0);
    dispatch("dateSelected", data[0].date);
  }
</script>

<div class="timeline" bind:this={timeline}></div>

<style>
  svg {
    user-select: none;
  }
</style>
