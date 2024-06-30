<script lang="ts">
  export let show;
  export let toggleShow;
</script>

<div class="toggles">
  {#each Object.keys(show) as option}
    <div class="toggle-item" on:click={() => toggleShow(option)}>
      <input type="checkbox" id={option} checked={show[option]} />
      <label for={option}>{option}</label>
    </div>
  {/each}
</div>

<style>
  .toggles {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-right: 20px;
  }
  .toggle-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .toggle-item input[type="checkbox"] {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #7597c9;
    border-radius: 4px;
    margin-right: 8px;
    position: relative;
    cursor: pointer;
  }
  .toggle-item input[type="checkbox"]:checked::before {
    content: "✔";
    font-size: 14px;
    color: #7597c9;
    position: absolute;
    top: -3px;
    left: 2px;
  }
  .toggle-item input[type="checkbox"]:checked {
    background-color: white;
  }
  .toggle-item label {
    font-size: 0.9rem;
    color: #333;
  }
</style>
