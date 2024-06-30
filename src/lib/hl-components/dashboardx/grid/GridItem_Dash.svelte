<script lang="ts">
  export let title = "";
  export let count = 0;
  export let countColor = "grey";
  export let drawer = false;
  export let scroll = false;
  export let height = 0;

  let open;
  const handleOpen = () => {
    open = !open;
  };
</script>

<div class="grid-item">
  <div class="grid-item-container">
    {#if title || count || drawer}
      <div class="grid-item-header">
        <p class="grid-item-title">{title}</p>
        <div class="grid-item-actions">
          {#if count}
            <div class="grid-item-count" style="color: {countColor}">
              {count}
            </div>
          {/if}
          {#if drawer}
            <button class="grid-item-handle" on:click={handleOpen}>
              {open ? "Close" : "Open"}
            </button>
          {/if}
        </div>
      </div>
      <div class="border" />
    {/if}
    {#if drawer && open}
      <div
        class="grid-item-content {scroll ? 'grid-item-scroll' : ''}"
        style={height ? `max-height: ${height}px` : ""}
      >
        <slot />
      </div>
    {:else if !drawer}
      <div
        class="grid-item-content {scroll ? 'grid-item-scroll' : ''}"
        style={height ? `max-height: ${height}px` : ""}
      >
        <slot />
      </div>
    {/if}
  </div>
</div>

<style>
  .grid-item {
    width: 100%;
    padding: 5px; /* Add consistent 5px gap around each card item */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }
  .grid-item-container {
    border: 1px solid lightgrey;
    border-radius: 5px;
    width: 100%;
    padding: 5px; /* Add consistent 5px gap around each card item */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }
  .border {
    border-bottom: 1px solid lightgrey;
    margin: 10px 0;
  }
  .grid-item-title {
    margin: 0;
    font-weight: 600;
    font-size: 1.2rem;
    padding: 10px;
    align-content: center;
  }
  .grid-item-header {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  .grid-item-count {
    margin: 10px;
    font-size: 1.2rem;
    padding: 10px;
    border: 1px solid grey;
    border-radius: 10px;
    padding: 5px 10px;
    text-align: center;
    align-content: center;
  }

  .grid-item-handle {
    margin: 10px;
    font-size: 1.2rem;
    padding: 10px;
    border: none;
    background: none;
    border-radius: 10px;
    padding: 5px 10px;
    text-align: center;
    align-content: center;
    cursor: pointer;
  }
  .grid-item-actions {
    display: flex;
    align-content: center;
  }
  .grid-item-scroll {
    overflow-y: auto;
  }
  .grid-item-scroll::-webkit-scrollbar-track {
    background-color: #f7f9fc;
  }
  .grid-item-scroll::-webkit-scrollbar-thumb {
    background-color: #c6e2f0;
    border-radius: 10px;
  }
  .grid-item-scroll::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
</style>
