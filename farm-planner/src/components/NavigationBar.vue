<template>
  <div id="navigation-bar">
    <div id="navigation-bar-header">
      Don't Starve Together Farm Planner
    </div>
    <div class="navigation-bar-divider"></div>
    <div id="navigation-bar-github">
      <a href="https://www.klei.com/games/dont-starve-together">
        <img src="../assets/navigationbar/dont-starve-together-logo.png"/>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationBar',
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#navigation-bar {
  height: 100%;
  padding-left: 30px;
  padding-right: 30px;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

#navigation-bar-header {
  letter-spacing: 2px;
  color: #ddd;
  text-shadow:
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}

#navigation-bar-github img {
  height: 45px;
}

#navigation-bar-github img:hover {
  filter: drop-shadow(0px 0px 3px white);
}

.navigation-bar-divider {
  flex: 1 0 30px;
}
</style>
