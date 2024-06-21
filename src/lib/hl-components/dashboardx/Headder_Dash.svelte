<script>
  import Icon from "./icons/Icon.svelte";
  import SearchDash from "./inputs/Search_Dash.svelte";

  const buttons = [
    { text: "All", color: "primary", icon: "Suitcase" },
    { text: "Need Help?", color: "secondary", icon: "Info" },
    { text: "MF", color: "danger" },
    { text: "", color: "danger", icon: "Exit" },
  ];
</script>

<div class="header-container">
  <div class="header-left">
    <SearchDash placeholder="for a property" />
  </div>
  <div class="header-right">
    {#each buttons as { text, color, icon }, i}
      <button class="btn">
        {#if icon}
          <Icon {icon} size={16} />
        {/if}
        <p class="button-text">{text}</p>
      </button>
      {#if i !== buttons.length - 1}
        <div class="nav-action-divider"></div>
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
