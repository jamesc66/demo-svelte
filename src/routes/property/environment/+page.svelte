<script>
  import Column from "$lib/hl-components/dashboardx/grid/GridColumn_Dash.svelte";
  import Item from "$lib/hl-components/dashboardx/grid/GridItem_Dash.svelte";
  import Grid from "$lib/hl-components/dashboardx/grid/GridTemplate_Dash.svelte";
  import Row from "$lib/hl-components/dashboardx/grid/GridRow_Dash.svelte";
  import Insert from "$lib/hl-components/dashboardx/grid/GridInsert_Dash.svelte";
</script>

<Grid>
  <Row>
    <Column>
      <Row>
        <Item>
          <Insert insert="Basic" title="Damp & Mould Risk" />
        </Item>
        <Item>
          <Insert insert="Basic" title="Heat Loss Risk" />
        </Item>
      </Row>

      <Item>
        <Insert insert="Bar" title="Monitored Rooms" />
      </Item>
      <Item>
        <Insert insert="Bar" title="Time to Lose 1C" />
      </Item>
      <Item>
        <Insert insert="Bar" title="Ttotal Active Alerts" />
      </Item>
      <Item>
        <Insert insert="Feed" title="Timeline" />
      </Item>
    </Column>

    <Column>
      <Item>
        <Insert insert="Drawer" title="Damp and Mould Risk Components" />
      </Item>
      <Item>
        <Insert insert="Chart" title="Humidity" />
      </Item>
      <Item>
        <Insert insert="Chart" title="Temperature" />
      </Item>
    </Column>
  </Row>
</Grid>
