<script lang="ts">
  import Headder from "$lib/components/Headder.svelte";
  import Ring from "$lib/hl-components/dashboardx/charts/Ring.svelte";

  export let title: string = "";
  export let subtitle: string = "";
  export let image: string = "";
  export let count: number = 0;
  export let countColor: string = "";
  export let description: string = "";
  export let status: string = "";
  export let statusColor: string = "";
  export let date: string = "";
  export let ringLabel: string = "";
  export let ringColor: string = "";
  export let ringTextSize: string = "";
  export let ringSize: number = 60;
</script>

<div class="feed-item-container">
  {#if image}
    <div class="feed-item-image" style="background-image: url({image});"></div>
  {/if}
  <div class="feed-item-content">
    <div class="insert-bar-text">
      {#if ringLabel}
        <Ring
          label={ringLabel}
          color={ringColor}
          size={ringSize}
          textSize={ringTextSize}
        />
      {/if}
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
    {#if description}
      <p class="feed-item-description">{description}</p>
    {/if}
    <div class="feed-item-footer">
      {#if status}
        <div class="feed-item-status" style="background-color: {statusColor}">
          {status.toUpperCase()}
        </div>
      {/if}
      {#if date}
        <div class="feed-item-date">
          {date}
        </div>
      {/if}
    </div>
  </div>
</div>
<div class="grid-item-border" />

<style>
  .feed-item-container {
    display: flex;
    width: 100%;
    padding: 5px;
    align-content: center;
    box-sizing: border-box;
  }

  .feed-item-image {
    background-color: lightgrey;
    height: 50px;
    width: 50px;
    border-radius: 5px;
    background-size: cover;
    background-position: center;
    margin-right: 10px;
  }

  .feed-item-content {
    /* flex-grow: 1; */
    margin-left: 10px;
    box-sizing: border-box;
  }

  .insert-bar-text {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .insert-bar-title {
    margin: 0px;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .insert-bar-subtitle {
    margin: 0px;
    font-size: 1.2rem;
  }

  .grid-item-count {
    margin: 10px;
    font-size: 1.2rem;
    padding: 10px;
    border: 1px solid grey;
    border-radius: 10px;
    padding: 5px 10px;
    text-align: center;
    align-content: center;
  }

  .feed-item-description {
    font-size: 1rem;
  }

  .feed-item-footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }

  .feed-item-status {
    padding: 5px;
    background: grey;
    border-radius: 5px;
    color: white;
    flex-shrink: 0;
  }

  .feed-item-date {
    flex-shrink: 0;
    margin-left: 10px;
    white-space: nowrap;
  }

  .grid-item-border {
    border-bottom: 1px solid lightgrey;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
