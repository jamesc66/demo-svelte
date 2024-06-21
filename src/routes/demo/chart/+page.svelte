<script>
  import Chart from "$lib/components/Chart.svelte";
  import { dataStore } from "$lib/stores";
  import { get } from "svelte/store";

  $: storeData = get(dataStore);
</script>

<main>
  <h1>Product Reviews Over Time</h1>

  <Chart data={storeData.reviews} config={storeData.charts} />
</main>
