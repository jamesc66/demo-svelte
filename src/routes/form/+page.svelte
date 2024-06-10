<script lang="ts">
  import Form from "$lib/components/Form.svelte";
  import { dataStore } from "$lib/stores";
  import { get } from "svelte/store";

  $: storeData = get(dataStore);

  const handleSubmit = (event: CustomEvent) => {
    console.log("Submitted data:", event.detail);
  };
</script>

{#if storeData.loading}
  <p>Loading...</p>
{:else}
  <h1>Users Form</h1>
  <Form
    fields={storeData.forms.users}
    data={storeData.users[0]}
    on:submit={handleSubmit}
  />

  <h1>Brands Form</h1>
  <Form
    fields={storeData.forms.brands}
    data={storeData.brands[0]}
    on:submit={handleSubmit}
  />

  <h1>Products Form</h1>
  <Form
    fields={storeData.forms.products}
    data={storeData.products[0]}
    on:submit={handleSubmit}
  />

  <h1>Reviews Form</h1>
  <Form
    fields={storeData.forms.reviews}
    data={storeData.reviews[0]}
    on:submit={handleSubmit}
  />
{/if}
