<script>
  import Insert from "$lib/hl-components/dashboardx/grid/GridInsert_Dash.svelte";
  import Item from "$lib/hl-components/dashboardx/grid/GridItem_Dash.svelte";
  import Grid from "$lib/hl-components/dashboardx/grid/GridTemplate_Dash.svelte";
</script>

<Grid>
  <Item>
    <Insert insert="Drawer" title="Generate an Event" />
  </Item>
  <Item>
    <Insert insert="Drawer" title="Record an Insight Result" />
  </Item>
</Grid>
