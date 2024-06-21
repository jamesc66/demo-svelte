<script lang="ts">
  import Form from "$lib/components/Form.svelte";
  import { dataStore } from "$lib/stores";
  import { get } from "svelte/store";

  $: storeData = get(dataStore);

  const handleSubmit = (event: CustomEvent) => {
    console.log("Submitted data:", event.detail);
  };

  $: console.log(storeData);
</script>

{#if storeData.loading}
  <p>Loading...</p>
{:else}
  {#each storeData.forms as form}
    <h1>{form.id}</h1>
    <Form
      fields={form.data}
      data={storeData?.[form.id]?.[0]}
      on:submit={handleSubmit}
    />
    <!-- <Form
    fields={storeData.forms.reviews}
    data={storeData.reviews[0]}
    on:submit={handleSubmit}
  /> -->
  {/each}
{/if}
