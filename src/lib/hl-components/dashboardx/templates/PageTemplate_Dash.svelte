<script>
  import HeadderDash from "../Headder_Dash.svelte";
  import SidebarDash from "../Sidebar_Dash.svelte";
  export let nav;
</script>

<div class="page-template-container">
  <div class="page-template-left">
    <SidebarDash {nav} />
  </div>
  <div class="page-template-right">
    <HeadderDash />
    <div class="page-template-content">
      <slot />
    </div>
  </div>
</div>

<style>
  .page-template-container {
    display: flex;
    height: 100%;
    background-color: #edf1f7;
    height: 100vh;
  }

  .page-template-left {
    width: 250px;
  }

  .page-template-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .page-template-content {
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    height: 100%;
  }
</style>
