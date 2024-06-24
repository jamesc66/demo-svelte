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
      <Insert insert="Basic" title="Damp and Mould Risk" />
    </Item>
    <Item>
      <Insert insert="Basic" title="Cold Home Risk" />
    </Item>
    <Item>
      <Insert insert="Basic" title="Void Risk" />
    </Item>
    <Item>
      <Insert insert="Basic" title="Air Quality Risk" />
    </Item>
  </Row>

  <Row>
    <Column>
      <Item>
        <Insert insert="Dropdown" title="Carbon Dioxide Levels Info" />
      </Item>

      <Row>
        <Item>
          <Insert insert="Basic" title="Monitored Rooms" />
        </Item>
        <Item>
          <Insert insert="Basic" title="Total Active Alerts" />
        </Item>
      </Row>
      <Item>
        <Insert insert="Feed" title="Timeline" />
      </Item>
    </Column>
    <Column>
      <Item>
        <Insert insert="Chart" title="Carbon Dioxide" />
      </Item>
      <Item>
        <Insert insert="Chart" title="CTemperature" />
      </Item>
    </Column>
  </Row>
</Grid>
