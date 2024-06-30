<script>
  import Insert from "$lib/hl-components/dashboardx/grid/GridInsert_Dash.svelte";
  import Item from "$lib/hl-components/dashboardx/grid/GridItem_Dash.svelte";
  import Row from "$lib/hl-components/dashboardx/grid/GridRow_Dash.svelte";

  const modelType = [
    {
      count: 38200,
      modelTypeId: "GATEWAY",
      modelTypeName: "Gateway",
    },
    {
      count: 136,
      modelTypeId: "WEATHER",
      modelTypeName: "Weather",
    },
    {
      count: 4,
      modelTypeId: "TEC_IMOK",
      modelTypeName: "T.E.C. I'm OK Button ",
    },
    {
      count: 7951,
      modelTypeId: "COALARM",
      modelTypeName: "Carbon Monoxide Alarm",
    },
    {
      count: 128210,
      modelTypeId: "FIREALARM",
      modelTypeName: "Fire Alarm",
    },
    {
      count: 13665,
      modelTypeId: "ENVCO2SENSOR",
      modelTypeName: "Environment & Carbon Dioxide Sensor",
    },
    {
      count: 20809,
      modelTypeId: "EIACCESSORY",
      modelTypeName: "Ei Accessory",
    },
    {
      count: 3,
      modelTypeId: "TEC_NOTOK",
      modelTypeName: "T.E.C. I'm Not OK Button",
    },
    {
      count: 6801,
      modelTypeId: "ENVSENSOR",
      modelTypeName: "Environment Sensor",
    },
    {
      count: 16015,
      modelTypeId: "FIRECOALARM",
      modelTypeName: "Carbon Monoxide & Fire Alarm",
    },
    {
      count: 1,
      modelTypeId: "SMARTMETERELEC",
      modelTypeName: "Smart Meter Electricity",
    },
    {
      count: 1,
      modelTypeId: "TEC_WEARABLE",
      modelTypeName: "T.E.C. Wearable",
    },
    {
      count: 1,
      modelTypeId: "SMARTMETERGASELEC",
      modelTypeName: "Smart Meter Gas & Electricity",
    },
  ];
  const insightsTrend = [
    {
      levelId: "LOW",
      values: [
        {
          date: "2024-03-01T00:00:00.000Z",
          value: 60038,
        },
        {
          date: "2024-04-01T00:00:00.000Z",
          value: 66755,
        },
        {
          date: "2024-05-01T00:00:00.000Z",
          value: 68853,
        },
      ],
    },
    {
      levelId: "PENDING",
      values: [
        {
          date: "2024-03-01T00:00:00.000Z",
          value: 14805,
        },
        {
          date: "2024-04-01T00:00:00.000Z",
          value: 14058,
        },
        {
          date: "2024-05-01T00:00:00.000Z",
          value: 14699,
        },
      ],
    },
    {
      levelId: "MEDIUM",
      values: [
        {
          date: "2024-03-01T00:00:00.000Z",
          value: 23524,
        },
        {
          date: "2024-04-01T00:00:00.000Z",
          value: 24183,
        },
        {
          date: "2024-05-01T00:00:00.000Z",
          value: 25284,
        },
      ],
    },
    {
      levelId: "HIGH",
      values: [
        {
          date: "2024-03-01T00:00:00.000Z",
          value: 13564,
        },
        {
          date: "2024-04-01T00:00:00.000Z",
          value: 13698,
        },
        {
          date: "2024-05-01T00:00:00.000Z",
          value: 12283,
        },
      ],
    },
  ];

  const activeAlertsTrends = [
    {
      eventCategoryId: "PRIORITY_MAINTENANCE",
      values: [
        {
          date: "2024-03-01T00:00:00.000Z",
          value: 1363,
        },
        {
          date: "2024-04-01T00:00:00.000Z",
          value: 5939,
        },
        {
          date: "2024-05-01T00:00:00.000Z",
          value: 8693,
        },
      ],
    },
    {
      eventCategoryId: "ALARM",
      values: [
        {
          date: "2024-03-01T00:00:00.000Z",
          value: 2247,
        },
        {
          date: "2024-04-01T00:00:00.000Z",
          value: 12244,
        },
        {
          date: "2024-05-01T00:00:00.000Z",
          value: 12376,
        },
      ],
    },
    {
      eventCategoryId: "MAINTENANCE",
      values: [
        {
          date: "2024-03-01T00:00:00.000Z",
          value: 6417,
        },
        {
          date: "2024-04-01T00:00:00.000Z",
          value: 34918,
        },
        {
          date: "2024-05-01T00:00:00.000Z",
          value: 43302,
        },
      ],
    },
  ];

  const active = [
    {
      count: 241,
      eventTypeId: "MAINS_ABSENT",
      eventTypeName: "Mains Absent",
      eventCategoryId: "MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 216,
      siteAffected: 0,
      mostRecentDate: "2023-08-22T06:34:31.000Z",
    },
    {
      count: 1,
      eventTypeId: "TAMPER",
      eventTypeName: "Tamper",
      eventCategoryId: "BEHAVIOUR",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 1,
      siteAffected: 0,
      mostRecentDate: "2021-01-20T17:09:01.000Z",
    },
    {
      count: 350,
      eventTypeId: "HEAD_REMOVED",
      eventTypeName: "Head removed",
      eventCategoryId: "PRIORITY_MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 309,
      siteAffected: 0,
      mostRecentDate: "2023-08-21T16:47:24.000Z",
    },
    {
      count: 1,
      eventTypeId: "CO_MEDIUM_LEVEL_ALARM",
      eventTypeName: "Medium level CO detected",
      eventCategoryId: "ALARM",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 1,
      siteAffected: 0,
      mostRecentDate: "2023-07-05T22:39:33.000Z",
    },
    {
      count: 33,
      eventTypeId: "GATEWAY_BATTERY_DISCONNECTED",
      eventTypeName: "Gateway battery disconnected",
      eventCategoryId: "MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 25,
      siteAffected: 0,
      mostRecentDate: "2023-08-22T01:30:32.000Z",
    },
    {
      count: 2,
      eventTypeId: "CO_LOW_LEVEL_ALARM",
      eventTypeName: "Low level CO detected",
      eventCategoryId: "ALARM",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 2,
      siteAffected: 0,
      mostRecentDate: "2023-08-11T20:11:32.000Z",
    },
    {
      count: 622,
      eventTypeId: "GATEWAY_OFFLINE",
      eventTypeName: "Gateway Offline",
      eventCategoryId: "MAINTENANCE",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 618,
      siteAffected: 0,
      mostRecentDate: "2023-08-22T01:35:01.000Z",
    },
    {
      count: 44,
      eventTypeId: "CO2_MEDIUM_PROLONGED",
      eventTypeName: "Prolonged CO2 Medium Risk",
      eventCategoryId: "MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 0,
      siteAffected: 0,
      mostRecentDate: "2023-08-21T12:39:45.000Z",
    },
    {
      count: 3,
      eventTypeId: "SENSOR_FAULT",
      eventTypeName: "Sensor Fault",
      eventCategoryId: "PRIORITY_MAINTENANCE",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 3,
      siteAffected: 0,
      mostRecentDate: "2023-02-04T11:13:32.000Z",
    },
    {
      count: 1,
      eventTypeId: "CO2_VERY_HIGH_PROLONGED",
      eventTypeName: "Prolonged CO2 Very High Risk",
      eventCategoryId: "ALARM",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 0,
      siteAffected: 0,
      mostRecentDate: "2022-02-22T14:40:12.000Z",
    },
    {
      count: 171,
      eventTypeId: "LOW_BATTERY_GATEWAY",
      eventTypeName: "Gateway battery low",
      eventCategoryId: "MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 170,
      siteAffected: 0,
      mostRecentDate: "2023-08-22T03:08:49.000Z",
    },
    {
      count: 182,
      eventTypeId: "FIRE_ALARM",
      eventTypeName: "Fire alarm activated",
      eventCategoryId: "ALARM",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 166,
      siteAffected: 0,
      mostRecentDate: "2023-08-22T12:56:38.000Z",
    },
    {
      count: 9,
      eventTypeId: "CO2_HIGH_PROLONGED",
      eventTypeName: "Prolonged CO2 High Risk",
      eventCategoryId: "PRIORITY_MAINTENANCE",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 0,
      siteAffected: 0,
      mostRecentDate: "2023-08-21T09:26:39.000Z",
    },
    {
      count: 5,
      eventTypeId: "CO_HIGH_LEVEL_ALARM",
      eventTypeName: "High level CO detected",
      eventCategoryId: "ALARM",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 4,
      siteAffected: 0,
      mostRecentDate: "2023-08-11T21:03:21.000Z",
    },
    {
      count: 2,
      eventTypeId: "LOW_BATTERY",
      eventTypeName: "Battery Low",
      eventCategoryId: "MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 2,
      siteAffected: 0,
      mostRecentDate: "2021-03-02T09:20:09.000Z",
    },
    {
      count: 509,
      eventTypeId: "GATEWAY_MAINS_ABSENT",
      eventTypeName: "Gateway mains absent",
      eventCategoryId: "MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 449,
      siteAffected: 0,
      mostRecentDate: "2023-08-22T09:22:25.000Z",
    },
    {
      count: 91,
      eventTypeId: "LOW_BATTERY_HEAD",
      eventTypeName: "Head battery low",
      eventCategoryId: "MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 80,
      siteAffected: 0,
      mostRecentDate: "2023-07-26T10:01:32.000Z",
    },
    {
      count: 1,
      eventTypeId: "LOW_BATTERY_GENERIC",
      eventTypeName: "Battery low",
      eventCategoryId: "MAINTENANCE",
      severity: "MEDIUM",
      alertStatusId: "ACTIVE",
      domesticAffected: 1,
      siteAffected: 0,
      mostRecentDate: "2022-11-06T20:55:19.000Z",
    },
    {
      count: 20,
      eventTypeId: "HARDWIRE_INTERCONNECT",
      eventTypeName: "Hardwire Interconnect alarm activated",
      eventCategoryId: "ALARM",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 18,
      siteAffected: 0,
      mostRecentDate: "2023-08-21T13:33:25.000Z",
    },
    {
      count: 1,
      eventTypeId: "END_OF_LIFE",
      eventTypeName: "End of Life",
      eventCategoryId: "PRIORITY_MAINTENANCE",
      severity: "HIGH",
      alertStatusId: "ACTIVE",
      domesticAffected: 1,
      siteAffected: 0,
      mostRecentDate: "2023-07-12T14:49:20.000Z",
    },
  ];

  const joinedAlertData = activeAlertsTrends.map((trend) => {
    // Find the corresponding alert that matches the trend's eventCategoryId
    const alert = active.find(
      (alert) => alert.eventCategoryId === trend.eventCategoryId
    );

    // Return the trend data combined with any found alert data
    return {
      ...trend,
      ...(alert ? alert : []), // Using `null` if no corresponding alert is found
    };
  });

  const getInsightTotal = (insight) => {
    return insight.values.reduce((acc, curr) => acc + curr.value, 0);
  };

  const getInsightsWithTotals = insightsTrend.map((insight) => {
    return {
      ...insight,
      total: getInsightTotal(insight),
    };
  });

  const totalConnectedDevices = modelType.reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  const activeAlertTypesCollumns = [
    { title: "", field: "eventTypeName" },
    { title: "#", field: "count", width: 70 },
    { title: "1", field: "domesticAffected", width: 70 },
    { title: "2", field: "siteAffected", width: 70 },
  ];

  const modelTypeColumns = [
    { title: "", field: "modelTypeName" },
    { title: "", field: "count", width: 70 },
  ];

  $: console.log({ joinedAlertData, insightsTrend });
</script>

<Row>
  <Item title="Active Alerts">
    <Insert
      insert="Trend"
      data={joinedAlertData}
      accessors={{
        title: "eventTypeName",
        count: "domesticAffected",
        color: "severity",
        id: "eventCategoryId",
        data: "values",
      }}
    />
  </Item>
  <Item title="Active Alert Types" scroll height={400}>
    <Insert insert="Table" columns={activeAlertTypesCollumns} data={active} />
  </Item>
  <Item
    title="Connected Devices Installed"
    scroll
    height={400}
    count={totalConnectedDevices}
  >
    <Insert insert="Table" columns={modelTypeColumns} data={modelType} />
  </Item>
</Row>

<Row>
  <Item>
    <Insert
      insert="Trend"
      data={getInsightsWithTotals}
      accessors={{
        title: "levelId",
        count: "total",
        color: "levelId",
        id: "levelId",
        data: "values",
      }}
    />
  </Item>
  <Item title="Insight Types">
    <Insert insert="Chart" />
  </Item>
  <Item>
    <Insert insert="Map" />
  </Item>
</Row>
