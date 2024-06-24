<script lang="ts">
  export let title: string;

  $: console.log(title);
</script>

{#if title}
  <h6>{title}</h6>
{/if}
<hr />

<div>Bar Insert</div>
