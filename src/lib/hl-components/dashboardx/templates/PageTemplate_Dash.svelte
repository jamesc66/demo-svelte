<script>
  import { onMount } from "svelte";
  import HeadderDash from "../Headder_Dash.svelte";
  import SidebarDash from "../Sidebar_Dash.svelte";
  import { fade } from "svelte/transition";
  export let animationDuration = 1000;
  export let animationOrder = false;
  export let nav;
  export let loading = true;

  onMount(() => {
    loading = false;
  });
</script>

<div class="page-template-container">
  <div class="page-template-left">
    <SidebarDash {animationOrder} {animationDuration} {nav} />
  </div>
  <div class="page-template-right">
    <HeadderDash {animationOrder} {animationDuration} />
    <div in:fade class="page-template-content">
      {#if !loading}
        <div in:fade>
          <slot />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .page-template-container {
    display: flex;
    height: 100%;
    background-color: #edf1f7;
    height: 100vh;
  }

  .page-template-left {
    width: 250px;
  }

  .page-template-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .page-template-content {
    margin: 20px;
    padding: 10px;
    border-radius: 10px;
    background-color: white;
    height: 100%;
    overflow-y: auto;
  }

  .page-template-content {
    overflow-y: auto;
    /* max-height: 300px; */
  }
  /* Style for the scrollbar track (part the thumb slides within) */
  .page-template-content::-webkit-scrollbar-track {
    background-color: #f7f9fc; /* Light grey track background */
  }

  /* Style for the scrollbar thumb (the part that you drag) */
  .page-template-content::-webkit-scrollbar-thumb {
    background-color: #c6e2f0; /* Dark grey thumb */
    border-radius: 10px; /* Optional: rounded corners for the thumb */
  }

  /* Style for the scrollbar itself (the whole scrollbar) */
  .page-template-content::-webkit-scrollbar {
    width: 5px; /* Thinner scrollbar width */
    height: 5px; /* Thinner scrollbar height for horizontal scrollbars */
  }
</style>
