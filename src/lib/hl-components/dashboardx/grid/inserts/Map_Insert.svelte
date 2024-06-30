<script>
  import { onMount, onDestroy } from "svelte";
  import { Map } from "mapbox-gl";
  import "../../../../../../node_modules/mapbox-gl/dist/mapbox-gl.css";

  let map;
  let mapContainer;
  let lng, lat, zoom;

  lng = -71.224518;
  lat = 42.213995;
  zoom = 9;

  function updateData() {
    zoom = map.getZoom();
    lng = map.getCenter().lng;
    lat = map.getCenter().lat;
  }

  onMount(() => {
    const initialState = { lng: lng, lat: lat, zoom: zoom };

    map = new Map({
      container: mapContainer,
      accessToken:
        "pk.eyJ1Ijoic2Ftc2hpbGVzIiwiYSI6ImNraWVldjluZTB4emoycHJzY3MwNGtubjMifQ._OqwEDmTLDqcsOswow2jEw",
      style: "mapbox://styles/samshiles/ckv9mabyv7y2s15qqjh5wotix",
      attributionControl: false,
      maxZoom: 17.9,
      center: [-2.6050526, 51.4558323],
      zoom: 10,
    });

    map.on("move", () => {
      updateData();
    });
  });

  onDestroy(() => {
    map.remove();
  });
</script>

<div class="map-wrap">
  <div class="map" bind:this={mapContainer} />
</div>

<style>
  .map {
    width: 100%;
    height: 100%;
  }

  .map-wrap {
    width: 100%;
    height: 600px;
  }
</style>
