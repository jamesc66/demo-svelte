<script>
  import { goto } from "$app/navigation";
  import { createEventDispatcher, onMount } from "svelte";
  import NavItemDash from "./NavItem_Dash.svelte";
  import Icon from "./icons/Icon.svelte";
  import { page } from "$app/stores";
  import { fly } from "svelte/transition";

  export let title;
  export let id;
  export let items = [];
  export let icon = "";
  export let open = false;
  export let active = "";
  export let animationDuration = 1000; // Total duration for all animations in ms
  export let loading = true;
  export let animationOrder = false; // Parameter to reverse the order of animations

  $: childSelected =
    items.filter((item) => `${id}/${item.id}` === active).length > 0;
  $: reverseOrder = childSelected; // New parameter to reverse the order of animations

  function naviageToPage(subId) {
    goto(`/${id}/${subId}`);
  }

  const dispatch = createEventDispatcher();

  function handleOpen() {
    dispatch("open");
  }

  // Configuration object for animation properties
  let animationConfig = {
    itemFlyDuration: 0,
    itemFlyDelayStep: 0,
  };

  onMount(() => {
    const totalElements = items.length;
    animationConfig.itemFlyDuration = animationDuration / (totalElements * 2);
    animationConfig.itemFlyDelayStep = animationDuration / totalElements / 2;
    loading = false;
  });
</script>

<div class="nav-group-container {childSelected ? 'open' : ''}">
  <NavItemDash {title} {icon} on:click={() => handleOpen()} />
  <div>
    {#if open === id}
      {#each items as item, i}
        {#if !loading}
          <div
            class="nav-group-item"
            in:fly={{
              x: reverseOrder ? 200 : -200,
              duration: animationConfig.itemFlyDuration,
              delay:
                (animationOrder ? i : items.length - 1 - i) *
                animationConfig.itemFlyDelayStep,
            }}
          >
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
        {/if}
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
