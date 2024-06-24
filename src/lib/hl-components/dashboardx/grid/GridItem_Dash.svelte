<script lang="ts">
</script>

<div class="grid-item-container">
  <slot />
</div>

<style>
  .grid-item-container {
    text-align: center;
    border: 1px solid lightgrey;
    border-radius: 5px;
    width: calc(100% - 10px); /* Adjust width to account for margin */
    margin: 5px; /* Add consistent 5mm gap around each card item */
  }
</style>
