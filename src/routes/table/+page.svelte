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
  <!-- <Table
    title="users"
    data={storeData.users}
    columns={storeData.columns.users}
    {options}
  />
  <Table
    title="brands"
    data={storeData.brands}
    columns={storeData.columns.brands}
    {options}
  />
  <Table
    title="products"
    data={storeData.products}
    columns={storeData.columns.products}
    {options}
  />
  <Table
    title="reviews"
    data={storeData.reviews}
    columns={storeData.columns.reviews}
    {options}
  /> -->
{/if}
