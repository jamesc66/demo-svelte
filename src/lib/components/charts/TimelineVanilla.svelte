<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import ResizeObserver from "resize-observer-polyfill";

  export let data: {
    date: string;
    insight: { room: string; insight: string; value: number }[];
  }[];

  export let speed = 5; // Speed of the auto slide

  const dispatch = createEventDispatcher();
  const position = tweened(0, { duration: 300, easing: cubicOut });

  let handleRadius = 5;
  let slider;
  let sliderWidth = 0;
  let numOfDays = 0;
  let isPlaying = false;
  let animationFrame;
  let resizeObserver;

  onMount(() => {
    updateSliderWidth();
    calculateNumOfDays();
    resizeObserver = new ResizeObserver(updateSliderWidth);
    resizeObserver.observe(slider);
  });

  onDestroy(() => {
    resizeObserver.disconnect();
    cancelAnimationFrame(animationFrame);
  });

  function updateSliderWidth() {
    if (slider) {
      sliderWidth = slider.clientWidth - handleRadius * 2;
    }
  }

  function calculateNumOfDays() {
    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    numOfDays = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  function handleMouseMove(event: MouseEvent) {
    const rect = slider.getBoundingClientRect();
    let xPos = event.clientX - rect.left - handleRadius;

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

  function handleMouseDown(event: MouseEvent) {
    handleMouseMove(event);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener(
      "mouseup",
      () => {
        window.removeEventListener("mousemove", handleMouseMove);
      },
      { once: true }
    );
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startAutoSlide();
    } else {
      cancelAnimationFrame(animationFrame);
    }
  }

  function startAutoSlide() {
    function slide() {
      let currentXPos;
      position.subscribe((value) => (currentXPos = value))();
      if (currentXPos > sliderWidth) {
        isPlaying = false;
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

<div
  style="width: 100%; height: 60px; display: flex; align-items: center; justify-content: center;"
>
  <div style="width: 70%; display: flex; align-items: center;">
    <svg width="30" height="40" style="cursor: pointer;" on:click={togglePlay}>
      {#if isPlaying}
        <rect x="8" y="8" width="6" height="24" fill="#7597C9" />
        <rect x="16" y="8" width="6" height="24" fill="#7597C9" />
      {:else}
        <polygon points="10,5 10,35 25,20" fill="#7597C9" />
      {/if}
    </svg>
    <svg
      bind:this={slider}
      width="100%"
      height="40"
      style="margin-left: 20px; margin-right: 20px; cursor: pointer;"
      on:mousedown={handleMouseDown}
    >
      <line
        x1={handleRadius}
        y1="20"
        x2={sliderWidth + handleRadius}
        y2="20"
        stroke="lightgray"
        stroke-width="2"
      />
      <circle
        cx={$position + handleRadius}
        cy="20"
        r={handleRadius}
        fill="white"
        stroke="#7597C9"
        stroke-width="2"
      />
    </svg>
    <svg width="30" height="40" style="cursor: pointer;" on:click={rewind}>
      <polygon points="20,5 20,35 5,20" fill="#7597C9" />
    </svg>
  </div>
</div>
<div
  style="text-align: center; margin-top: -20px; margin-bottom: 20px; font-size: 0.8rem;"
>
  Last {numOfDays} days
</div>

<style>
  svg {
    user-select: none;
  }
</style>
