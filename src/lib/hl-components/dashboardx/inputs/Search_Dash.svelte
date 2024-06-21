<script lang="ts">
  import Icon from "../icons/Icon.svelte";

  export let placeholder = "";
</script>

<div class="search-container">
  <span class="search-icon">
    <Icon icon="Search" size={16} />
  </span>
  <input class="search-input" placeholder="search {placeholder}" />
</div>

<style>
  .search-container {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    /* Add styles for your icon, such as font-size and color */
  }

  .search-input {
    width: 100%;
    padding: 10px;
    padding-left: 40px; /* Adjust this value to match the width of your icon */
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 16px;
  }
</style>
