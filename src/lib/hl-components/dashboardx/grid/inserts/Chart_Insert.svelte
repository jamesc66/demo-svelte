<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import Radar from "$lib/components/charts/Radar.svelte";
  import SplitRadar from "$lib/components/charts/SplitRadar.svelte";
  import Timeline from "$lib/components/charts/Timeline.svelte";
  import TimelineVanilla from "$lib/components/charts/TimelineVanilla.svelte";
  import Xy from "$lib/components/charts/XY.svelte";
  import { createEventDispatcher } from "svelte";

  export let title: string;
  export let config: any;
  export let data: any;

  $: date = data[0]?.date;
  $: selectedData = data.find((d) => d.date === date);

  const dispatch = createEventDispatcher();

  function handleDateSelected(event) {
    // dispatch("customEvent", event);
    date = event.detail;
  }
</script>

{#if config && data.length}
  {#if config.variant === "xy"}
    <Xy {config} {data} />
  {:else if config.variant === "radar"}
    <Radar {config} data={selectedData?.[config.dataKey]} allData={data} />
    <Timeline {data} on:dateSelected={handleDateSelected} />
  {:else if config.variant === "split-radar"}
    <SplitRadar
      {config}
      data={selectedData?.[config.dataKey]}
      allData={data}
      on:dateSelected={handleDateSelected}
    />
    <!-- <TimelineVanilla {data} on:dateSelected={handleDateSelected} /> -->
  {/if}
{/if}
