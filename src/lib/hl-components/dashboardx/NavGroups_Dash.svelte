<script lang="ts">
  import NavGroupDash from "./NavGroup_Dash.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { fly } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let nav;
  export let open = "";
  export let active = "";
  export let loading = true;
  export let animationDuration = 1000; // Total duration for all animations in ms
  export let animationOrder = false; // Parameter to reverse the order of animations

  let animationConfig = {
    itemFlyDuration: 0,
    itemFlyDelayStep: 0,
  };

  onMount(() => {
    loading = false;

    const totalElements = nav.length;
    animationConfig.itemFlyDuration = animationDuration / (totalElements * 2);
    animationConfig.itemFlyDelayStep = animationDuration / totalElements / 2;
  });

  function handleOpen(id) {
    dispatch("open", id);
  }
</script>

<div class="sidebar-menu">
  {#each nav as { title, items, icon, id }, i}
    {#if !loading}
      <div
        in:fly={{
          x:
            items.filter((item) => `${id}/${item.id}` === active).length > 0
              ? 200
              : -200,
          duration: animationConfig.itemFlyDuration,
          delay: animationOrder
            ? i * animationConfig.itemFlyDelayStep
            : (nav.length - 1 - i) * animationConfig.itemFlyDelayStep,
        }}
      >
        <NavGroupDash
          {title}
          {items}
          {icon}
          {id}
          {open}
          {active}
          {animationDuration}
          {animationOrder}
          on:open={() => handleOpen(id)}
          on:click
        />
      </div>
    {/if}
  {/each}
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
