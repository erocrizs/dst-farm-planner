<template>
  <div id="app">
    <div id="navigation-bar-container">
      <NavigationBar/>
    </div>
    <div id="field-canvas-container">
      <FieldCanvas/>
    </div>
    <div id="tool-bar-container">
      <ToolBar 
        @selected="setAction"
        :currentAction="currentAction"/>
    </div>
    <div id="status-bar-container">
      <StatusBar/>
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
  },
  data () {
    return {
      currentAction: null
    }
  },
  methods: {
    setAction (action) {
      this.currentAction = action
    }
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
  }

  #navigation-bar-container {
    height: 50px;
  }

  #field-canvas-container {
    height: 100vw;
  }

  #status-bar-container {
    min-height: calc(100vh - 100px - 100vw);
  }

  #tool-bar-container {
    height: 60px;
    background-color: #1b180e;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media screen and (min-width: 780px) {
    #app {  
      display: grid;
      grid-template: 50px 1fr 60px / 1fr 300px;
    }

    #navigation-bar-container {
      grid-area: 1/1/span 1/span 2;
    }

    #field-canvas-container {
      grid-area: 2/1/span 2/span 1;
      height: inherit;
    }

    #status-bar-container {
      grid-area: 2/2/span 2/span 1;
    }

    #tool-bar-container {
      height: auto;
      grid-area: 3/1/span 1/span 1;
      background-color: transparent;

      display: block;
    }
  }
</style>
