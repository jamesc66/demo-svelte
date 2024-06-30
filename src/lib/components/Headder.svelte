<script lang="ts">
  export let title: string;
  export let subtitle: string;
  export let image: string;
  export let count: number;
  export let countColor: string = "grey";
</script>

<div class="insert-bar-container">
  {#if image}
    <div class="instart-bar-contaienr-image" />
  {/if}
  <div class="insert-bar-text">
    <div>
      {#if title}
        <p class="insert-bar-title">
          {title}
        </p>
      {/if}

      {#if subtitle}
        <p class="insert-bar-subtitle">
          {subtitle}
        </p>
      {/if}
    </div>

    <div>
      {#if count}
        <div class="grid-item-count" style="border-color: {countColor}">
          {count}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .insert-bar {
  }

  .insert-bar-container {
    display: flex;
    margin: 0;
    margin: 5px; /* Add consistent 5mm gap around each card item */
  }

  .instart-bar-contaienr-image {
    background-color: lightgrey;
    height: 50px;
    width: 50px;
    border-radius: 5px;
    margin-right: 10px;
  }

  .insert-bar-text {
    /* margin: 0px 0px 0px 10px; */
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .insert-bar-title {
    margin: 0px;
    font-weight: bold;
    font-size: 1rem;
  }
  .insert-bar-subtitle {
    margin: 0px;
    font-size: 0.8rem;
  }

  .grid-item-count {
    margin: 10px;
    font-size: 1.2rem;
    padding: 10px;
    border: 1px solid grey;
    border-radius: 10px;
    padding: 5px 10px 5px 10px;
    text-align: center;
    align-content: center;
  }
</style>
