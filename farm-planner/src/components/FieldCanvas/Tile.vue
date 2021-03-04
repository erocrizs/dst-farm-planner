<template>
  <div class="tile" :class="{plotted}">
    <div class="plot-container">
      <div
        v-if="plotted"
        v-for="(plotData, index) in tileData.plotList"
        :key="index">
        <Plot
          :plotData="plotData"
          :currentAction="currentAction"/>
      </div>
    </div>
  </div>
</template>

<script>
import Plot from './Plot'

import {field} from './const'

const {plotSizePx} = field;

export default {
  name: 'Tile',
  components: {Plot},
  props: ['tileData', 'currentAction'],
  data () {
    return {
      plotted: this.tileData.plotted
    }
  },
  computed: {
    plotGridStyle () {
      const gridTemplateRows = `px `.repeat(3).trim()
      const gridTemplateColumns = `${plotSizePx}px `.repeat(3).trim()
      return {
        display: 'grid',
        gridTemplateRows,
        gridTemplateColumns
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile {
  height: 100%;
  border: 2px dashed green;
  box-sizing: border-box;
}

.tile.plotted {
  background-image: url("../../assets/canvas/Farm_Soil_Texture.png");
  background-size: 192px;
  background-repeat: no-repeat;
  border: 2px solid #231910;
}

.plot-container {
  height: 100%;
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr)
}
</style>
