<template>
  <div id="app">
    <div id="navigation-bar-container">
      <NavigationBar/>
    </div>
    <div id="field-canvas-container">
      <FieldCanvas/>
    </div>
    <div id="status-bar-container">
      <StatusBar/>
    </div>
    <div id="tool-bar-container">
      <ToolBar/>
    </div>
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar'
import FieldCanvas from './components/FieldCanvas'
import StatusBar from './components/StatusBar'
import ToolBar from './components/ToolBar'

export default {
  name: 'App',
  components: {
    NavigationBar,
    FieldCanvas,
    StatusBar,
    ToolBar
  }
}
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
  }

  #app {
    height: 100%;
    display: grid;
    grid-template: 50px 1fr 50px / 1fr 500px;
  }

  #navigation-bar-container {
    grid-area: 1/1/span 1/span 2;
  }

  #field-canvas-container {
    grid-area: 2/1/span 2/span 1;
  }

  #status-bar-container {
    grid-area: 2/2/span 2/span 1;
  }

  #tool-bar-container {
    grid-area: 3/1/span 1/span 1;
  }
</style>
