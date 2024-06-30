<script lang="ts">
  export let series = [];
  export let selectedSeries: Set<string>;
  export let seriesColorMap = new Map();
  export let toggleSeries: (d: string) => void;

  export let show = true;
</script>

<div class="legend">
  {#each series as d}
    <div class="legend-item" on:click={() => toggleSeries(d)}>
      <div
        class="line"
        style="background-color: {seriesColorMap.get(d)}; visibility: {show
          ? 'visible'
          : 'hidden'};"
      ></div>
      <label style="color: {seriesColorMap.get(d)}">{d}</label>
    </div>
  {/each}
</div>

<style>
  .legend {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .line {
    width: 16px; /* Standard checkbox width */
    height: 2px;
    margin-right: 8px;
    transition: visibility 0.3s;
  }
</style>
