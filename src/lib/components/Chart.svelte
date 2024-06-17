<script>
  import { onMount } from "svelte";
  import { dataStore } from "$lib/stores";
  import { get } from "svelte/store";
  import { initializeChart } from "./chart";

  export let config = undefined;
  export let data = undefined;

  let chartContainer;

  $: data = get(dataStore);

  $: if (data?.reviews?.length) {
    initializeChart(chartContainer, data.reviews, config);
  }
</script>

<main>
  {#if data?.reviews?.length}
    <div bind:this={chartContainer}></div>
  {:else}
    <p>Loading...</p>
  {/if}
</main>
