<script>
  import { onMount } from "svelte";
  import { dataStore, loadData } from "$lib/stores";
  import Nav from "$lib/components/Nav.svelte";

  let loading = true;

  onMount(async () => {
    await loadData();
    loading = false;
  });
</script>

<Nav />

{#if $dataStore.loading}
  <p>Loading data...</p>
{:else}
  <slot />
{/if}
