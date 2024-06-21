<script>
  import Icon from "./icons/Icon.svelte";

  export let title;
  export let icon = "";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("click");
  }
</script>

<button class="nav-item" on:click={handleClick}>
  <div class="nav-icon">
    <Icon {icon} />
  </div>
  <span class="nav-title">{title}</span>
</button>

<style>
  .nav-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    width: 100%;
  }

  .nav-icon {
    margin-right: 10px;
  }

  .nav-title {
    font-weight: bold;
  }
</style>
