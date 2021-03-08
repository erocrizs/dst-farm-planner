<template>
  <div id="status-bar" class="column-flex">
    <div id="farm-title" class="section-header padding">
      <input id="farm-title-input" 
        type="text"
        v-model="farmName"
        maxlength="32"
        placeholder="Name Your Farm Here!"/>
    </div>
    <div id="season-select">
      <div id="season-selector-label">
        Season
      </div>
      <div>
        <SeasonSwitch
          v-for="(season, index) in seasons"
          :key="index"
          :config="season"
          :selected="isSeasonSelected(season)"
          @clicked="seasonClicked"/>
      </div>
    </div>
    
    <hr class="section-divider"/>

    <div class="column-flex remaining-height" :class="showOnAction('plant')">
      <CropSelector 
        :currentAction="currentAction"
        :actionDetails="actionDetails"
        @setActionDetails="setActionDetails"
        />
    </div>
    <div class="column-flex remaining-height"  :class="showOnAction('export')">
      <Exporter
        :fieldState="fieldState"
        :currentSeason="currentSeason"
        :farmName="farmName"
        />
    </div>
    <div class="column-flex remaining-height"  v-if="this.currentAction === 'import'">
      <Importer
        :fieldState="fieldState"
        :currentSeason="currentSeason"
        :farmName="farmName"
        />
    </div>
  </div>
</template>

<script>
import SeasonSwitch from './StatusBar/SeasonSwitch'
import CropSelector from './StatusBar/CropSelector'
import Exporter from './StatusBar/Exporter'
import Importer from './StatusBar/Importer'

import seasons from '@/library/seasons'

export default {
  name: 'StatusBar',
  components: {
    SeasonSwitch,
    CropSelector,
    Exporter,
    Importer
  },
  props: [
    'currentSeason',
    'currentAction',
    'actionDetails',
    'fieldState'
  ],
  data () {
    return {
      seasons,
      farmName: ''
    }
  },
  methods: {
    seasonClicked (season) {
      this.$emit('selectSeason', season)
    },
    isSeasonSelected (config) {
      return config.season === this.currentSeason
    },
    actionSelected (action) {
      return action === this.currentAction
    },
    setActionDetails (actionDetails) {
      this.$emit('setActionDetails', actionDetails)
    },
    showOnAction (action) {
      return {'hidden-section': this.currentAction !== action}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#status-bar {
  height: 100%;
}

.section-header {
  font-family: belisa_plumilla;
  text-align: center;
}

#farm-title input, #farm-title input::placeholder {
  font-family: belisa_plumilla;
  font-size: 1em;
  font-weight: bolder;
  width: 100%;
  text-align: center;
  border: 0px;
  background-color: transparent;
  color: inherit;
}

#farm-title input:focus::placeholder {
  color: transparent;
}

.section-divider {
  width: 80%;
  border-width: thin;
  border-style: solid;
}

#season-select {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.padding {
  padding: 15px;
}

.space-around {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row wrap;
}

.remaining-height {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0px;
}

.remaining-height::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.remaining-height::-webkit-scrollbar-track {
  background: transparent; 
}
 
/* Handle */
.remaining-height::-webkit-scrollbar-thumb {
  background: #342517; 
}

/* Handle on hover */
.remaining-height::-webkit-scrollbar-thumb:hover {
  background: #ccc; 
}

.column-flex {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.hidden-section {
  display: none !important;
}
</style>
