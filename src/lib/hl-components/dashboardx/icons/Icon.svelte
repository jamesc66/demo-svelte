<script>
  export let icon;
  export let size = 24;
  export let color = "black";
  let IconComponent;

  // Dynamically import the icon component based on the icon
  if (icon) {
    import(`./${icon}_Icon.svelte`).then((module) => {
      IconComponent = module.default;
    });
  }
</script>

{#if IconComponent}
  <div class="icon-container">
    <svelte:component this={IconComponent} {size} {color} />
  </div>
{:else}
  <!-- <p>{icon}</p> -->
{/if}

<style>
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
  }
</style>
