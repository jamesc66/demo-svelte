<script lang="ts">
  export let title: string;
  export let data: any;
</script>

<div class="tag-insert-container">
  <div class="tag-container">
    {#each data as item}
      <div class="tag">
        {item}
      </div>
    {/each}
  </div>
</div>

<style>
  .tag-insert-container {
    display: flex;
    flex-direction: column;
    margin: 5px;
  }

  .title {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .tag-container {
    display: flex;
    flex-wrap: wrap;
    color: #3669ff;
  }

  .tag {
    background-color: #f5faff;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
  }
</style>
