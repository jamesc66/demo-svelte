<script>
  export let insert;
  export let title = "";
  export let subtitle = "";
  export let accessors = null;
  export let data = [];
  export let columns = {};
  export let config = {};
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
    <svelte:component
      this={InsertComponent}
      {title}
      {subtitle}
      {data}
      {accessors}
      {columns}
      {config}
    />
  </div>
{:else}
  <div>{insert}</div>
{/if}

<style>
  .insert-container {
  }
</style>
