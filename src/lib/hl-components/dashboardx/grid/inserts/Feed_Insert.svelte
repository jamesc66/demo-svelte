<script lang="ts">
  import FeedItem from "$lib/feed/FeedItem.svelte";

  export let subtitle: string;
  export let title: string;
  export let data: any;
</script>

{#each data as item}
  <FeedItem {...item} />
{/each}
