<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import { dataStore } from "$lib/stores";
  import { get } from "svelte/store";

  $: storeData = get(dataStore);

  const options = {
    pagination: "local",
    paginationSize: 5,
  };
</script>

{#if storeData.loading}
  <p>Loading...</p>
{:else}
  {#each storeData.columns as columns}
    <Table
      title={columns.id}
      data={storeData[columns.id]}
      columns={columns.data}
      {options}
    />
  {/each}
{/if}
