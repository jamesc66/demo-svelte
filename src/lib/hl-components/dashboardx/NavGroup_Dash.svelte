<script>
  import { goto } from "$app/navigation";
  import { createEventDispatcher, onMount } from "svelte";
  import NavItemDash from "./NavItem_Dash.svelte";
  import Icon from "./icons/Icon.svelte";
  export let title;
  export let id;
  export let items = [];
  export let icon = "";
  export let open = false;
  export let active = "";
  import { page } from "$app/stores";

  $: childSelected =
    items.filter((item) => `${id}/${item.id}` === active).length > 0;

  let isSelected = $page.url.pathname.includes(title.toLowerCase());

  function naviageToPage(subId) {
    goto(`/${id}/${subId}`);
  }

  const dispatch = createEventDispatcher();

  function handleOpen() {
    dispatch("open");
  }
  $: console.log("open", active);
</script>

<div class="nav-group-container {childSelected ? 'open' : ''}">
  <NavItemDash {title} {icon} on:click={() => handleOpen()} />
  <div>
    {#if open === id}
      {#each items as item, i}
        <div class="nav-group-item">
          <Icon
            icon="Circle"
            size={10}
            color={active === `${id}/${item.id}` ? "blue" : "transparent"}
          />
          <NavItemDash
            title={item.title}
            on:click={() => naviageToPage(item.id)}
          />
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .nav-group-container {
    cursor: pointer;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    padding: 10px 0 10px 10px;
  }
  .open {
    background: white;
  }

  .nav-group-item {
    padding-left: 20px;
    display: flex;
    align-items: center;
  }
</style>
