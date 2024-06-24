<script lang="ts">
  export let title: string;
</script>

<div>
  Default Insert

  {#if title}
    <h6>{title}</h6>
  {/if}
</div>
