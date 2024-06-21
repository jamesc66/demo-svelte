<script>
  import { onMount } from "svelte";
  import { dataStore, loadData } from "$lib/stores";
  import Nav from "$lib/components/Nav.svelte";
  import PageTemplateDash from "$lib/hl-components/dashboardx/templates/PageTemplate_Dash.svelte";
  export let data;
  let loading = true;

  onMount(async () => {
    await loadData();
    loading = false;
  });
</script>

<!-- <Nav /> -->

<PageTemplateDash nav={data.config.nav}>
  {#if $dataStore.loading}
    <p>Loading data...</p>
  {:else}
    <slot />
  {/if}
</PageTemplateDash>

<style>
  :global(body) {
    margin: 0;
    font-family: "Open Sans", sans-serif;
  }
</style>
