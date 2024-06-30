<script lang="ts">
  export let title: string;
  export let subtitle: string;

  $: console.log(title);
</script>

<div class="insert-bar-container">
  <div class="instart-bar-contaienr-image" />
  <div class="insert-bar-text">
    <p class="insert-bar-title">
      {title}
    </p>
    <p class="insert-bar-subtitle">
      {subtitle}
    </p>
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
  }

  .insert-bar-text {
    margin: 0px 0px 0px 10px;
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
</style>
