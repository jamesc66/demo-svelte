<script>
  export let label = "0";
  export let size = 70; // Default size, can be overridden by passing a prop
  export let color = "red"; // Default color, can be overridden by passing a prop
  export let textSize = "1rem"; // Default color, can be overridden by passing a prop
</script>

<div class="ring-chart-container" style="height: {size}px; width: {size}px; ">
  <div
    class="outer-ring"
    style="border-width: {size * 0.05}px; height: {size * 0.9}px; width: {size *
      0.9}px; border-color:{color};"
  >
    <div
      class="inner-ring"
      style="border-width: {size * 0.05}px; height: {size *
        0.7}px; width: {size * 0.7}px; border-color:{color}"
    >
      <div
        class="ring-content"
        style="height: {size * 0.5}px; width: {size * 0.5}px;"
      >
        <div class="ring-label" style="color:{color}; font-size: {textSize}">
          {label}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .ring-chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;
    align-self: center;
  }

  .outer-ring {
    border-color: grey;
    border-style: solid;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .inner-ring {
    border-color: grey;
    border-style: solid;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .ring-content {
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .ring-label {
    text-align: center;
    font-size: 1rem; /* Consider scaling font size with the component */
    font-weight: bold;
  }
</style>
