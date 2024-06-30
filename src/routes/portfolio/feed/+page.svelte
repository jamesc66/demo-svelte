<script>
  import Column from "$lib/hl-components/dashboardx/grid/GridColumn_Dash.svelte";
  import Insert from "$lib/hl-components/dashboardx/grid/GridInsert_Dash.svelte";
  import Item from "$lib/hl-components/dashboardx/grid/GridItem_Dash.svelte";
  import Row from "$lib/hl-components/dashboardx/grid/GridRow_Dash.svelte";
  import Grid from "$lib/hl-components/dashboardx/grid/GridTemplate_Dash.svelte";

  const insightAlerts = [
    {
      status: "ACTIVE",
      count: 4,
      mostRecentAlertDate: "2024-06-26T09:02:31.000Z",
      eventTypeId: "GATEWAY_OFFLINE",
      eventTypeName: "Gateway Offline",
      eventTypeDescription: "Gateway Offline",
      isInsight: 0,
      propertyCount: 4,
      domesticCount: 4,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 1,
      mostRecentAlertDate: "2023-06-30T11:58:41.000Z",
      eventTypeId: "HEAD_REMOVED",
      eventTypeName: "Head removed",
      eventTypeDescription: "The head has been removed from the baseplate",
      isInsight: 0,
      propertyCount: 1,
      domesticCount: 1,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 2,
      mostRecentAlertDate: "2022-08-09T20:48:20.000Z",
      eventTypeId: "LOW_BATTERY_GATEWAY",
      eventTypeName: "Gateway battery low",
      eventTypeDescription: "A gateway has a low battery",
      isInsight: 0,
      propertyCount: 2,
      domesticCount: 2,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 3,
      mostRecentAlertDate: "2022-06-12T03:22:00.000Z",
      eventTypeId: "AIRQUALITY_MEDIUM",
      eventTypeName: "Poor Air Quality Risk Medium",
      eventTypeDescription:
        "This property or room is at medium risk of having poor air quality",
      isInsight: 1,
      propertyCount: 2,
      domesticCount: 2,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 4,
      mostRecentAlertDate: "2022-06-11T20:00:00.000Z",
      eventTypeId: "CO_HIGH_LEVEL_ALARM",
      eventTypeName: "High level CO detected",
      eventTypeDescription: "A high level of carbon monoxide has been detected",
      isInsight: 0,
      propertyCount: 3,
      domesticCount: 3,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 2,
      mostRecentAlertDate: "2022-06-11T03:33:00.000Z",
      eventTypeId: "VENTILATION_MEDIUM",
      eventTypeName: "Draught Risk Medium",
      eventTypeDescription:
        "This property or room is at medium risk of being a draughty home",
      isInsight: 1,
      propertyCount: 2,
      domesticCount: 2,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 1,
      mostRecentAlertDate: "2022-03-05T03:30:00.000Z",
      eventTypeId: "ALLERGENS_MEDIUM",
      eventTypeName: "Dust Mite Allergens Risk Medium",
      eventTypeDescription:
        "This property or room is at medium risk of having dust mite allergens",
      isInsight: 1,
      propertyCount: 1,
      domesticCount: 1,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 3,
      mostRecentAlertDate: "2022-03-05T03:28:00.000Z",
      eventTypeId: "DAMPMOULD_RISK_HIGH",
      eventTypeName: "Damp and Mould Risk High",
      eventTypeDescription:
        "This property or room is at high risk of having damp and mould",
      isInsight: 1,
      propertyCount: 3,
      domesticCount: 3,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 1,
      mostRecentAlertDate: "2022-03-05T03:27:00.000Z",
      eventTypeId: "DAMPMOULD_RISK_MEDIUM",
      eventTypeName: "Damp and Mould Risk Medium",
      eventTypeDescription:
        "This property or room is at medium risk of having damp and mould",
      isInsight: 1,
      propertyCount: 1,
      domesticCount: 1,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 1,
      mostRecentAlertDate: "2022-02-21T03:28:00.000Z",
      eventTypeId: "HEATLOSS_MEDIUM",
      eventTypeName: "Heat Loss Risk Medium",
      eventTypeDescription:
        "This property or room is at medium risk of having excessive heat loss",
      isInsight: 1,
      propertyCount: 1,
      domesticCount: 1,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 2,
      mostRecentAlertDate: "2021-07-13T19:33:41.000Z",
      eventTypeId: "MAINS_ABSENT",
      eventTypeName: "Mains Absent",
      eventTypeDescription: "Mains Power is absent",
      isInsight: 0,
      propertyCount: 2,
      domesticCount: 2,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 1,
      mostRecentAlertDate: "2021-05-11T22:27:36.000Z",
      eventTypeId: "CO_LOW_LEVEL_ALARM",
      eventTypeName: "Low level CO detected",
      eventTypeDescription: "A low level of carbon monoxide has been detected",
      isInsight: 0,
      propertyCount: 1,
      domesticCount: 1,
      siteCount: 0,
      zoneCount: 0,
    },
    {
      status: "ACTIVE",
      count: 1,
      mostRecentAlertDate: "2021-01-20T17:09:01.000Z",
      eventTypeId: "TAMPER",
      eventTypeName: "Tamper",
      eventTypeDescription: "Device has been tampered with",
      isInsight: 0,
      propertyCount: 1,
      domesticCount: 1,
      siteCount: 0,
      zoneCount: 0,
    },
  ];

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
</script>

<Row>
  <Item height={800} scroll>
    <Insert insert="Feed" title="title" subtitle="subtitle" data={feedData} />
  </Item>
  <Item>
    <Insert insert="Map" />
  </Item>
</Row>
