<script>
  import Chart from "$lib/components/Chart.svelte";
  import { dataStore } from "$lib/stores";
  import { get } from "svelte/store";

  // Reactive store data
  $: storeData = get(dataStore);

  const config = {
    margin: {
      top: 20,
      right: 30,
      bottom: 30,
      left: 40,
    },
    width: 500,
    height: 300,
    metrics: [
      "overall_rating",
      "quality",
      "value_for_money",
      "ease_of_use",
      "customer_service",
      "features",
      "performance",
      "reliability",
      "design",
      "packaging",
    ],
  };
</script>

<main>
  <h1>Product Reviews Over Time</h1>

  <Chart data={storeData.reviews} {config} />
</main>
