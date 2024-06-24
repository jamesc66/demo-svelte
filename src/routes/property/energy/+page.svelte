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
      <Insert insert="Basic" title="Fuel Poverty Risk" />
    </Item>
    <Item>
      <Insert insert="Basic" title="Heating Type" />
    </Item>
    <Item>
      <Insert insert="Basic" title="Carbon Dioxide Emissions All" />
    </Item>
    <Item>
      <Insert insert="Basic" title="Similar Carbonb Dioxide Output As" />
    </Item>
    <Item>
      <Insert insert="Basic" title="Trees Required to Absorb" />
    </Item>
  </Row>

  <Row>
    <Item>
      <Insert insert="Feed" title="Timeline" />
    </Item>
    <Item>
      <Insert insert="Basic" title="Energy Consumption" />
    </Item>
  </Row>
</Grid>
