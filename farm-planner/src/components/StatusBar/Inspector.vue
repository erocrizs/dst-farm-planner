<template>
  <div id="inspector" class="column-flex remaining-height">
    <div class="section-header">
      Inspect Crops
    </div>
    <div id="inspect-farm">
      <div class = "subsection-header">
        Farm Status: {{JSON.stringify(farmDetail)}}
      </div>
    </div>
    <div id="inspect-tile" v-if="tileDetail">
      <div class = "subsection-header">
        Tile Status: {{JSON.stringify(tileDetail)}}
      </div>
    </div>
    <div id="inspect-plot" v-if="plotDetail">
      <div class = "subsection-header">
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
    'plotDetail'
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
</style>