<script>
  import { onMount } from "svelte";
  export let data, columns;

  let tableComponent;

  onMount(async () => {
    if (typeof window !== "undefined") {
      const { TabulatorFull: Tabulator } = await import("tabulator-tables");
      new Tabulator(tableComponent, {
        data: data, // link data to table
        reactiveData: true, // enable data reactivity
        columns: columns, // define table columns
        layout: "fitColumns", // fit columns to width of table (optional)
      });
    }
  });
</script>

<div bind:this={tableComponent}></div>

<svelte:head>
  <link
    href="https://unpkg.com/tabulator-tables@4.9.1/dist/css/tabulator.min.css"
    rel="stylesheet"
  />
  <link href="/details-table.css" rel="stylesheet" />
</svelte:head>
