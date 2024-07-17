<script>
  import Column from "$lib/hl-components/dashboardx/grid/GridColumn_Dash.svelte";
  import Item from "$lib/hl-components/dashboardx/grid/GridItem_Dash.svelte";
  import Grid from "$lib/hl-components/dashboardx/grid/GridTemplate_Dash.svelte";
  import Row from "$lib/hl-components/dashboardx/grid/GridRow_Dash.svelte";
  import Insert from "$lib/hl-components/dashboardx/grid/GridInsert_Dash.svelte";
  import Chart from "$lib/hl-components/dashboardx/charts/Chart.svelte";
  import { onMount } from "svelte";
  const notes = [
    {
      count: 6,
      raisedDate: "2024-01-15T16:59:14.962Z",
    },
  ];

  const feedData = notes.map((note) => ({
    title: "Property Note",
    subtitle: "Note",
    description: "Notes that have been added to the property",
    status: null,
    date: note.raisedDate,
    count: note.count,
    statusColor: "red",
    countColor: "red",
    image: "image",
  }));

  let data = [];
  let seriesData = [];
  let selectedDateData = [];

  onMount(async () => {
    const dataRes = await fetch("/mock/room-insights.json");
    const humidityRes = await fetch("/mock/humidity.json");
    const mouldRes = await fetch("/mock/mould.json");
    const temperatureRes = await fetch("/mock/temperature.json");

    const humidityData = await humidityRes.json();
    const mouldData = await mouldRes.json();
    const temperatureData = await temperatureRes.json();

    const newData = await dataRes.json();

    seriesData = [
      { name: "humidity", data: humidityData },
      { name: "temperature", data: temperatureData },
      { name: "mould", data: mouldData },
    ];

    data = newData;
    selectedDateData = data[0].insight; // Default to the first date's insights
  });

  const radarConfig = {
    variant: "radar",
    nKey: "room",
    xKey: "insight",
    yKey: "value",
    dataKey: "insight",
    timeKey: "date",
    seriesKey: "room",
    show: [
      "grid",
      "axis",
      "areas",
      "points",
      "lines",
      "heat",
      "annotations",
      "shadedSegments",
    ],
    togle: true,
    defaultFeatures: [
      "axis",
      "lines",
      "areas",
      "grid",
      "points",
      "annotations",
      "shadedSegments",
    ],
    margin: { top: 40, right: 100, bottom: 0, left: 100 },
    width: 500,
    height: 400,
    colors: [
      "#4383DD", // Blue
      "#F47ED4", // Pink
      "#57CAAB", // Teal
      "#DDC543", // Yellow (Triadic to Blue)
      "#DD4343", // Red (Triadic to Teal)
      "#DD8743", // Orange (Triadic to Pink)
      "#3560A8", // Darker Blue Shade
      "#DF6BBD", // Darker Pink Shade
      "#4AA68F", // Darker Teal Shade
    ],
    shadedSegments: [
      { startAxis: 2.5, endAxis: 3.5, color: "white", opacity: 1 },
      { startAxis: 5.5, endAxis: 6.5, color: "white", opacity: 1 },
    ],
  };

  const xyConfig = {
    variant: "xy",
    nKey: "location",
    xKey: "date",
    yKey: "value",
    dKey: "values",
    ticks: 5,
    show: ["grid", "axis", "areas", "points", "rounded-lines", "enableZoom"],
    defaultFeatures: ["axis", "rounded-lines", "enableZoom"],
    margin: { top: 20, right: 40, bottom: 40, left: 40 },
    lineWidth: 1,
    pointWidth: 2,
    width: 500,
    height: 400,
    enableZoom: true,
    colors: [
      "#4383DD", // Blue
      "#F47ED4", // Pink
      "#57CAAB", // Teal
      "#DDC543", // Yellow (Triadic to Blue)
      "#DD4343", // Red (Triadic to Teal)
      "#DD8743", // Orange (Triadic to Pink)
      "#3560A8", // Darker Blue Shade
      "#DF6BBD", // Darker Pink Shade
      "#4AA68F", // Darker Teal Shade
    ],
  };
</script>

<Grid>
  <Row>
    <Column>
      <Row>
        <Item title="Damp & Mould Risk">
          <Insert
            insert="Ring"
            config={{
              ringSize: 60,
              ringTextSize: "0.8rem",
              ringColor: "red",
              ringLabel: "High",
            }}
          />
        </Item>
        <Item title="Heat Loss Risk">
          <Insert
            insert="Ring"
            config={{
              ringSize: 60,
              ringTextSize: "0.8rem",
              ringColor: "red",
              ringLabel: "High",
            }}
          />
        </Item>
      </Row>

      <Item>
        <Insert insert="Bar" subtitle="0" title="Monitored Rooms" />
      </Item>
      <Item>
        <Insert insert="Bar" subtitle="0" title="Time to Lose 1C" />
      </Item>
      <Item>
        <Insert insert="Bar" subtitle="0" title="Ttotal Active Alerts" />
      </Item>
      <Item height={800} scroll>
        <Insert
          insert="Feed"
          title="title"
          subtitle="subtitle"
          data={feedData}
        />
      </Item>
    </Column>

    <Column>
      <Item title="Damp and Mould Risk Components" drawer={true}>
        <Insert insert="Chart" {data} config={radarConfig} />
      </Item>
      <Item title="Humidity">
        <Insert insert="Chart" data={seriesData[0]?.data} config={xyConfig} />
      </Item>
      <Item title="Termperature">
        <!-- <Insert insert="Chart" title="Temperature" /> -->
        <Insert insert="Chart" data={seriesData[1]?.data} config={xyConfig} />
      </Item>
    </Column>
  </Row>
</Grid>
