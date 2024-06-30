<script lang="ts">
  import Trend from "../../charts/Trend.svelte";

  export let title: string;
  export let accessors;
  export let data = [];

  const gerSeverity = (severity) => {
    if (severity === "HIGH") {
      return "red";
    } else if (severity === "MEDIUM") {
      return "orange";
    } else if (severity === "LOW") {
      return "green";
    } else {
      return "grey";
    }
  };
</script>

{#each data as item, index}
  <Trend
    title={item[accessors.title]}
    data={item[accessors.data]}
    id={item[accessors.id]}
    count={item[accessors.count]}
    color={gerSeverity(item[accessors.color])}
    height={80}
  />

  {#if index !== data.length - 1}
    <div class="border"></div>
  {/if}
{/each}

<style>
  .border {
    border-bottom: 1px solid lightgrey;
    margin: 10px 0;
  }
</style>
