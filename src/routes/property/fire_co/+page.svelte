<script>
  import Column from "$lib/hl-components/dashboardx/grid/GridColumn_Dash.svelte";
  import Insert from "$lib/hl-components/dashboardx/grid/GridInsert_Dash.svelte";
  import Item from "$lib/hl-components/dashboardx/grid/GridItem_Dash.svelte";
  import Row from "$lib/hl-components/dashboardx/grid/GridRow_Dash.svelte";
  import Grid from "$lib/hl-components/dashboardx/grid/GridTemplate_Dash.svelte";
</script>

<Grid>
  <Row>
    <Item>
      <Insert insert="Bar" title="Monitored Rooms" />
    </Item>
    <Item>
      <Insert insert="Bar" title="Total Active Alerts" />
    </Item>
    <Item>
      <Insert insert="Bar" title="Fire & CO Status" />
    </Item>
    <Item>
      <Insert insert="Bar" title="Gateway Status" />
    </Item>
    <Item>
      <Insert insert="Bar" title="?" />
    </Item>
  </Row>
  <Row>
    <Item>
      <Insert insert="Feed" title="Timeline" />
    </Item>

    <Item>
      <Insert insert="Table" title="Products" />
    </Item>
  </Row>
</Grid>
