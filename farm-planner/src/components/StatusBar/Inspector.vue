<template>
  <div id="inspector" class="column-flex remaining-height">
    <div class="section-header">
      Inspect Crops
    </div>
    <div id="inspect-farm">
      <div class="subsection-header">
        Farm Stats
      </div>
      <div class="detail-label">
        Total Seeds Needed:
      </div>
      <SeedList :seeds="farmDetail.seeds"/>
      <div class="detail-label">
        Total Farm Yield: 
      </div>
      <YieldList :yields="farmDetail.yield"/>
    </div>
    <hr class="section-divider" v-if="tileDetail"/>
    <div id="inspect-tile" v-if="tileDetail">
      <div class="subsection-header">
        Tile Stats: {{JSON.stringify(tileDetail)}}
      </div>
    </div>
    <hr class="section-divider" v-if="plotDetail"/>
    <div id="inspect-plot" v-if="plotDetail">
      <div class="subsection-header">
        Plot Status: {{JSON.stringify(plotDetail)}}
      </div>
    </div>
  </div>
</template>

<script>
import YieldList from './Inspector/YieldList'
import SeedList from './Inspector/SeedList'

export default {
  name: 'Inspector',
  props: [
    'farmDetail',
    'tileDetail',
    'plotDetail',
    'season'
  ],
  components: {
    YieldList,
    SeedList
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.subsection-header {
  margin-top: 10px;
  margin-bottom: 10px;
}

.detail-label {
  font-size: 0.8em;
}
</style>