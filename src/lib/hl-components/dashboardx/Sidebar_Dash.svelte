<script lang="ts">
  import { onMount } from "svelte";
  import NavGroupDash from "./NavGroup_Dash.svelte";
  import { page } from "$app/stores";
  export let nav;

  let logoUrl = "";

  $: open = $page.url.pathname.split("/")[1];
  $: active =
    $page.url.pathname.split("/")[1] + "/" + $page.url.pathname.split("/")[2];

  onMount(async () => {
    const response = await fetch("/homelink-circle-logo.png");

    if (response.ok) {
      logoUrl = URL.createObjectURL(await response.blob());
    }
  });

  function handleOpen(mainTitle) {
    if (open === mainTitle) {
      open = "";
    } else {
      open = mainTitle;
    }
  }
</script>

<div class="sidebar-container">
  <div class="sidebar-logo">
    <img src={logoUrl} alt="Logo" />
  </div>
  <div class="sidebar-menu">
    {#each nav as { title, items, icon, id }, i}
      <NavGroupDash
        {title}
        {items}
        {icon}
        {id}
        {open}
        {active}
        on:open={() => handleOpen(id)}
      />
    {/each}
  </div>
</div>

<style>
  .sidebar-container {
    width: 250px;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 20px;
  }

  .sidebar-logo {
    display: flex;
    justify-content: center;
  }

  .sidebar-menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 100px;
  }

  img {
    width: 70px;
  }
</style>
