<template>
  <div id="status-bar">
    <div class="section-header">Farm Status</div>
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
  </div>
</template>

<script>
import seasonConst from './Seasons/const'
import SeasonSwitch from './StatusBar/SeasonSwitch'

export default {
  name: 'StatusBar',
  components: {
    SeasonSwitch
  },
  props: ['currentSeason'],
  data () {
    return {
      seasons: seasonConst.seasons
    }
  },
  methods: {
    seasonClicked (season) {
      this.$emit('selectSeason', season)
    },
    isSeasonSelected (config) {
      return config.season === this.currentSeason
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#status-bar {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.section-header {
  font-family: belisa_plumilla;
  text-align: center;
  padding: 15px;
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
</style>
