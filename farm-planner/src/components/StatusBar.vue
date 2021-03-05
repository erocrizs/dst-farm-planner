<template>
  <div id="status-bar">
    <div class="section-header padding">Farm Status</div>
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

    <div v-if="actionSelected('plant')" class="remaining-height">
      <div class="section-header">
        Plant Crops
      </div>
      <CropSelector 
        :currentAction="currentAction"
        :actionDetails="actionDetails"
        @setActionDetails="setActionDetails"
        />
    </div>
  </div>
</template>

<script>
import {seasons} from './Seasons/const'
import SeasonSwitch from './StatusBar/SeasonSwitch'
import CropSelector from './StatusBar/CropSelector'

export default {
  name: 'StatusBar',
  components: {
    SeasonSwitch,
    CropSelector
  },
  props: [
    'currentSeason',
    'currentAction',
    'actionDetails'
  ],
  data () {
    return {
      seasons
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#status-bar {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.section-header {
  font-family: belisa_plumilla;
  text-align: center;
  font-size: 1.25em;
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
  flex-grow: 1;
}

</style>
