<script>
  export let data = [];

  const previousValue = data[1].value; // April value
  const lastValue = data[2].value; // May value
  const difference = lastValue - previousValue;
  const percentageChange = (difference / previousValue) * 100;

  // Determine the direction of the trend
  const direction = difference >= 0 ? "up" : "down";
</script>

<div class="trend">
  <div class="figures">
    <svg width="10" height="10" class={direction === "up" ? "up" : "down"}>
      <polygon
        points="0,10 5,0 10,10"
        fill={direction === "up" ? "red" : "green"}
      />
    </svg>
    {difference} <span class="subtext">(+{percentageChange.toFixed(2)}%)</span>
  </div>
  <span class="subtext">since last month</span>
</div>

<style>
  .trend {
    font-family: Arial, sans-serif;
    line-height: 1.5;
    text-align: center;
    align-content: center;
  }

  .up,
  .down {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }

  .subtext {
    display: block;
    font-size: 0.8rem;
    color: #666;
  }
  .figures {
    display: flex;
  }
</style>
