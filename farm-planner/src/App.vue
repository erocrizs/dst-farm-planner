<template>
  <div id="app">
    <div id="navigation-bar-container">
      <NavigationBar/>
    </div>
    <div id="field-canvas-container">
      <FieldCanvas
        :currentAction="currentAction"
        :currentSeason="currentSeason"/>
    </div>
    <div id="tool-bar-container">
      <ToolBar 
        @selectAction="setAction"
        :currentAction="currentAction"/>
    </div>
    <div id="status-bar-container">
      <StatusBar
        @selectSeason="setSeason"
        @setActionDetails="setActionDetails"
        :currentAction="currentAction"
        :currentSeason="currentSeason"
        :actionDetails="actionDetails"/>
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
      currentAction: null,
      currentSeason: 'autumn',
      actionDetails: null
    }
  },
  methods: {
    setAction (action) {
      this.currentAction = action
    },
    setSeason (season) {
      this.currentSeason = season
    },
    setActionDetails (actionDetails) {
      this.actionDetails = actionDetails
    }
  }
}
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
    background-color: #222;
  }

  #app {
    height: 100%;
  }

  #navigation-bar-container {
    height: 75px;

    border-width: 0px; 
    border-bottom-width: 2px;
    border-style: outset;
    background-color: #333;
    border-color: #222;
  }

  #field-canvas-container {
    height: 100vw;
  }

  #status-bar-container {
    border: ridge #48321f;
    border-width: 4px;
    padding: 10px;
    background-color: #9b7b5d;
    color: #342517;

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
      grid-template: 75px 1fr 60px / 1fr 300px;
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
    }
  }
</style>
