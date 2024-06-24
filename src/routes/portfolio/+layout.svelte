<script>
  import Column from "$lib/hl-components/dashboardx/grid/GridColumn_Dash.svelte";
  import Insert from "$lib/hl-components/dashboardx/grid/GridInsert_Dash.svelte";
  import Item from "$lib/hl-components/dashboardx/grid/GridItem_Dash.svelte";
  import Row from "$lib/hl-components/dashboardx/grid/GridRow_Dash.svelte";
  import Grid from "$lib/hl-components/dashboardx/grid/GridTemplate_Dash.svelte";
</script>

<div>
  <Grid>
    <Row>
      <Item>
        <Insert insert="Bar" title="connected sites" />
      </Item>
      <Item>
        <Insert insert="Bar" title="Connected Zones" />
      </Item>
      <Item>
        <Insert insert="Bar" title="Monitored Rooms" />
      </Item>
      <Item>
        <Insert insert="Bar" title="Connected Properties" />
      </Item>
    </Row>
    <slot />
  </Grid>
</div>
