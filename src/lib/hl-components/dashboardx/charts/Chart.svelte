<script>
  import Radar from "$lib/components/charts/Radar.svelte";
  import Timeline from "$lib/components/charts/Timeline.svelte";
  import Xy from "$lib/components/charts/XY.svelte";
  import { onMount } from "svelte";

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
      { name: "mould", data: mouldData },
      { name: "temperature", data: temperatureData },
    ];

    data = newData;
    selectedDateData = data[0].insight; // Default to the first date's insights
  });

  let config = {
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
      "legend",
      "tooltip",
      "lines",
      "heat",
    ],
    togle: true,
  };

  const xyConfig = {
    nKey: "location",
    xKey: "date",
    yKey: "value",
    dataKey: "values",
    seriesKey: "location",
    show: ["grid", "axis", "areas", "points", "legend", "tooltip", "lines"],
  };

  function handleDateSelected(event) {
    const selectedDate = event.detail;
    const selectedData = data.find((d) => d.date === selectedDate);
    if (selectedData) {
      selectedDateData = selectedData.insight;
    }
  }
</script>

{#if data.length > 0}
  <Xy config={xyConfig} data={seriesData[0].data} />
  <Timeline {data} on:dateSelected={handleDateSelected} />
  <Radar {config} data={selectedDateData} allData={data} />
{:else}
  <p>Loading...</p>
{/if}
