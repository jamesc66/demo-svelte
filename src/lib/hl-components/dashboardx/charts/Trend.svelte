<script lang="ts">
  import Ring from "../charts/Ring.svelte";
  import Trend from "../charts/Trend.svelte";
  import SimpleLine from "../charts/TrendLine.svelte";
  import TrendText from "./TrendText.svelte";

  export let data = [];
  export let id = "";
  export let count = 0;
  export let color = "";
  export let title = "";
  export let height = 100;
</script>

<div class="trend-insert-container">
  <p class="title">
    {title}
  </p>
  <div class="visualisation-container">
    <Ring {data} {id} label={count} {color} size={height} />
    <SimpleLine {data} {id} {height} {color} />
    <TrendText {data} {id} />
  </div>
</div>

<style>
  .trend-insert-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 10px;
  }
  .visualisation-container {
    width: 100%;
    display: flex;
    margin: 10px;
    align-items: center;
    place-content: center;
  }
  .title {
    font-size: 0.8rem;
    margin: 0;
  }
</style>
