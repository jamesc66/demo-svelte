<script lang="ts">
  import Ring from "../../charts/Ring.svelte";
  import Trend from "../../charts/Trend.svelte";

  export let config = {};
</script>

<div class="ring-insert-container">
  <Ring
    label={config.ringLabel}
    size={config.ringSize}
    color={config.ringColor}
    textSize={config.ringTextSize}
  />
</div>

<style>
  .border {
    border-bottom: 1px solid lightgrey;
    margin: 10px 0;
  }

  .ring-insert-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;
    align-self: center;
    margin-bottom: 10px;
  }
</style>
