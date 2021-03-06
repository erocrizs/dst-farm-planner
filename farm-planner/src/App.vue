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
        :actionDetails="currentActionDetail"/>
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
      currentActionDetail: null,
      currentSeason: 'autumn',
      actionDetails: {}
    }
  },
  methods: {
    setAction (action) {
      this.currentAction = action
      this.currentActionDetail = this.actionDetails[this.currentAction] || null
    },
    setSeason (season) {
      this.currentSeason = season
    },
    setActionDetails (actionDetails) {
      this.actionDetails[this.currentAction] = actionDetails
      this.currentActionDetail = actionDetails
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
    
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
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
    min-height: 500px;
    max-height: calc(100vh - 170px);
    overflow: auto;
  }

  #field-canvas-container::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  /* Track */
  #field-canvas-container::-webkit-scrollbar-track {
    background: #342517; 
  }

  /* Track */
  #field-canvas-container::-webkit-scrollbar-corner {
    background: #342517; 
  }
  
  /* Handle */
  #field-canvas-container::-webkit-scrollbar-thumb {
    background: #9b7b5d; 
  }

  #status-bar-container {
    border: ridge #48321f;
    border-width: 4px;
    padding: 10px;
    background-color: #9b7b5d;
    color: #342517;

    flex-grow: 1;
    max-height: 100vh;
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
      max-height: none;
    }

    #status-bar-container {
      grid-area: 2/2/span 2/span 1;
      max-height: none;
    }

    #tool-bar-container {
      height: auto;
      z-index: 1;
      grid-area: 3/1/span 1/span 1;
      background-color: transparent;
    }
  }
</style>
