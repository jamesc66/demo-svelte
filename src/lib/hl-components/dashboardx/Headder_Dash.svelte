<script>
  import { onMount } from "svelte";
  import Icon from "./icons/Icon.svelte";
  import SearchDash from "./inputs/Search_Dash.svelte";
  import { fly } from "svelte/transition";

  export let loading = true;
  export let animationDuration = 1000; // Total duration for all animations in ms
  export let animationOrder = true; // New parameter to reverse the order of animations

  let animationConfig = {
    buttonFlyDuration: 0,
    buttonFlyDelayStep: 0,
    searchBarFlyDuration: 0,
    searchBarFlyDelay: 0,
  };

  const buttons = [
    { text: "All", color: "primary", icon: "Suitcase" },
    { text: "Need Help?", color: "secondary", icon: "Info" },
    { text: "MF", color: "danger" },
    { text: "", color: "danger", icon: "Exit" },
  ];

  onMount(() => {
    loading = false;

    const totalElements = buttons.length + 1; // Buttons + SearchBar
    animationConfig.buttonFlyDuration = animationDuration / (totalElements * 2);
    animationConfig.buttonFlyDelayStep = animationDuration / totalElements / 2;
    animationConfig.searchBarFlyDuration = animationConfig.buttonFlyDuration;
    animationConfig.searchBarFlyDelay =
      buttons.length * animationConfig.buttonFlyDelayStep;
  });
</script>

<div class="header-container">
  {#if !loading}
    <div
      class="header-left"
      in:fly={{
        y: -200,
        duration: animationConfig.searchBarFlyDuration,
        delay: animationOrder ? 0 : animationConfig.searchBarFlyDelay,
      }}
    >
      <SearchDash placeholder="for a property" />
    </div>
  {/if}
  <div class="header-right">
    {#each buttons as { text, color, icon }, i (i)}
      {#if !loading}
        <button
          class="btn"
          in:fly={{
            y: -200,
            duration: animationConfig.buttonFlyDuration,
            delay: animationOrder
              ? i * animationConfig.buttonFlyDelayStep
              : (buttons.length - 1 - i) * animationConfig.buttonFlyDelayStep,
          }}
        >
          {#if icon}
            <Icon {icon} size={16} />
          {/if}
          <p class="button-text">{text}</p>
        </button>
        {#if i !== buttons.length - 1}
          <div class="nav-action-divider"></div>
        {/if}
      {/if}
    {/each}
  </div>
</div>

<style>
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px;
  }

  .nav-action-divider {
    width: 1px;
    height: 20px;
    background-color: black;
    margin: 0 10px;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    background-color: transparent;
    align-items: center;
    display: flex;
  }

  .button-text {
    margin-left: 10px;
  }
</style>
