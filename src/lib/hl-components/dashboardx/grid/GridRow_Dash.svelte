<script lang="ts">
</script>

<div class="grid-column-container">
  <slot />
</div>

<style>
  .grid-column-container {
    display: flex;
    /* gap: 10px; */
    width: 100%;
    /* gap: 1rem; */
  }
  .grid-column-direction-row {
    flex-direction: row;
  }
  .grid-column-direction-column {
    flex-direction: column;
  }
</style>
