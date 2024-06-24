<script>
  import Insert from "$lib/hl-components/dashboardx/grid/GridInsert_Dash.svelte";
  import Item from "$lib/hl-components/dashboardx/grid/GridItem_Dash.svelte";
  import Row from "$lib/hl-components/dashboardx/grid/GridRow_Dash.svelte";
</script>

<Row>
  <Item>
    <Insert insert="Trend" title="Active Alerts" />
  </Item>
  <Item>
    <Insert insert="Table" title="Active Alert Types" />
  </Item>
  <Item>
    <Insert insert="Table" title="Connected Devices Installed" />
  </Item>
</Row>

<Row>
  <Item>
    <Insert insert="Trend" title="Insights" />
  </Item>
  <Item>
    <Insert insert="Chart" title="Insight Types" />
  </Item>
  <Item>
    <!-- <Insert insert="table" /> -->
    map
  </Item>
</Row>
