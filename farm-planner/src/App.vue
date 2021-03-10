<template>
  <div id="app">
    <div id="navigation-bar-container">
      <NavigationBar/>
    </div>
    <div id="startup-container" v-if="!fieldState">
      <Startup
        :season="currentSeason"
        @finishSetup="setupFarm"/>
    </div>
    <div id="field-canvas-container" v-if="fieldState">
      <FieldCanvas
        ref="field"
        :currentAction="currentAction"
        :currentSeason="currentSeason"
        :actionDetails="currentActionDetail"
        :fieldState="fieldState"
        @inspect="inspect"
        @action="actionDone"/>
    </div>
    <div id="tool-bar-container" v-if="fieldState">
      <ToolBar 
        @selectAction="setAction"
        :currentAction="currentAction"/>
    </div>
    <div id="status-bar-container">
      <StatusBar
        @selectSeason="setSeason"
        @setActionDetails="setActionDetails"
        @loadSave="loadSave"
        :currentAction="currentAction"
        :currentSeason="currentSeason"
        :actionDetails="currentActionDetail"
        :fieldState="fieldState"
        :farmDetail="farmDetail"
        :tileDetail="tileDetail"
        :plotDetail="plotDetail"/>
    </div>
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar'
import FieldCanvas from './components/FieldCanvas'
import StatusBar from './components/StatusBar'
import ToolBar from './components/ToolBar'
import Startup from './components/Startup'

import field from '@/library/field'

const actionKeyCodeShortcut = {
  Digit1: 'inspect',
  Digit2: 'plant',
  Digit3: 'destroy',
  Digit4: 'plot',
  Digit5: 'flatten',
  Digit6: 'export'
}

export default {
  name: 'App',
  components: {
    NavigationBar,
    FieldCanvas,
    StatusBar,
    ToolBar,
    Startup
  },
  data () {
    return {
      currentAction: 'import',
      currentActionDetail: null,
      currentSeason: field.defaultSeason,
      fieldState: null,
      actionDetails: {},
      farmDetail: null,
      tileDetail: null,
      plotDetail: null,
      undoStack: [],
      redoStack: []
    }
  },
  mounted () {
    window.debugFarm = () => {
      this.$refs.field.farmData.debugLog()
    }
    window.debugTile = (col, row) => {
      this.$refs.field.farmData.getTile(col, row)
        .debugLog(this.currentSeason)
    }
    document.addEventListener('keydown', e => this.keydown(e))
  },
  methods: {
    setAction (action) {
      this.currentAction = action
      this.currentActionDetail = this.actionDetails[this.currentAction] || null

      if (action === 'export') {
        this.fieldState = this.$refs.field.toJSON()
      }
      else if (action === 'inspect') {
        this.farmDetail = this.$refs.field.farmData.inspectReport()
        this.tileDetail = null
        this.plotDetail = null
      }
    },
    setSeasonUndoable (season) {
      const lastSeason = this.currentSeason
      this.currentSeason = season

      if (this.fieldState) {
        this.$refs.field.farmData.season = season
        this.fieldState = this.$refs.field.toJSON()
      }

      if (this.currentAction === 'inspect') {
        this.farmDetail = this.$refs.field.farmData.inspectReport()
      }

      return {
        type: 'setSeasonUndoable',
        revert: () => this.setSeasonUndoable(lastSeason)
      }
    },
    setSeason (season, skipUndo = false) {
      const action = this.setSeasonUndoable(season)
      if (!skipUndo) {
        this.actionDone(action)
      }
    },
    setActionDetails (actionDetails) {
      this.actionDetails[this.currentAction] = actionDetails
      this.currentActionDetail = actionDetails
    },
    loadSave (fieldState) {
      this.undoStack = []
      this.redoStack = []
      this.setupFarm(fieldState)
    },
    setupFarm (fieldState) {
      this.currentAction = null
      this.currentActionDetail = null
      this.fieldState = fieldState
      this.currentSeason = fieldState.season
      this.width = fieldState.width
      this.height = fieldState.height
    },
    inspect ({tileDetail, plotDetail}) {
      this.tileDetail = tileDetail
      this.plotDetail = plotDetail
    },
    actionDone (action) {
      this.undoStack.push(action)
      this.redoStack = []
    },
    keydown (event) {
      if (document.activeElement.tagName === 'INPUT') {
        return
      }

      if (
        (event.ctrlKey && event.shiftKey && event.code === 'KeyZ')
        || (event.ctrlKey && event.code === 'KeyY')
      ) {
        this.redo()
        event.preventDefault()
        return
      }
      else if (event.ctrlKey && event.code === 'KeyZ') {
        this.undo()
        event.preventDefault()
        return
      }

      if (
        !event.ctrlKey
        && !event.shiftKey
        && this.fieldState
      ) {
        const action = actionKeyCodeShortcut[event.code]
        if (action) {
          this.setAction(action)
          event.preventDefault()
        }
      }
    },
    undo () {
      if (this.undoStack.length === 0) {
        return
      }

      const action = this.undoStack.pop()

      if (action && action.revert) {
        const redo = action.revert()
        this.redoStack.push(redo)
      }
    },
    redo () {
      if (this.redoStack.length === 0) {
        return
      }

      const action = this.redoStack.pop()

      if (action && action.revert) {
        const undo = action.revert()
        this.undoStack.push(undo)
      }
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
    pointer-events: none;
  }
  
  #startup-container {
    background-color: #9b7b5d;
    color: #342517;
    min-height: 500px;
    max-height: calc(100vh - 170px);
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

    #startup-container {
      grid-area: 2/1/span 2/ span 1;
      max-height: none;
    }
  }
</style>
