<script>
  export let insert;
  export let title = "";
  let InsertComponent;

  // Dynamically import the insert component based on the insert
  if (insert) {
    import(`./inserts/${insert}_Insert.svelte`).then((module) => {
      InsertComponent = module.default;
    });
  }
</script>

{#if InsertComponent}
  <div class="insert-container">
    <svelte:component this={InsertComponent} {title} />
  </div>
{:else}
  <div>{insert}</div>
{/if}

<style>
  .insert-container {
  }
</style>
