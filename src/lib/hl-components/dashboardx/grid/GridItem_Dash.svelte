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

<div class="grid-item-container">
  {#if title || count || drawer}
    <div class="grid-item-headder">
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

<style>
  .grid-item-container {
    /* text-align: center; */
    border: 1px solid lightgrey;
    border-radius: 5px;
    width: calc(100% - 10px); /* Adjust width to account for margin */
    margin: 5px; /* Add consistent 5mm gap around each card item */
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
  .grid-item-headder {
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
    padding: 5px 10px 5px 10px;
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
    padding: 5px 10px 5px 10px;
    text-align: center;
    align-content: center;
  }
  .grid-item-actions {
    display: flex;
    align-content: center;
  }
  .grid-item-scroll {
    overflow-y: auto;
    /* max-height: 300px; */
  }
  /* Style for the scrollbar track (part the thumb slides within) */
  .grid-item-scroll::-webkit-scrollbar-track {
    background-color: #f7f9fc; /* Light grey track background */
  }

  /* Style for the scrollbar thumb (the part that you drag) */
  .grid-item-scroll::-webkit-scrollbar-thumb {
    background-color: #c6e2f0; /* Dark grey thumb */
    border-radius: 10px; /* Optional: rounded corners for the thumb */
  }

  /* Style for the scrollbar itself (the whole scrollbar) */
  .grid-item-scroll::-webkit-scrollbar {
    width: 5px; /* Thinner scrollbar width */
    height: 5px; /* Thinner scrollbar height for horizontal scrollbars */
  }
</style>
