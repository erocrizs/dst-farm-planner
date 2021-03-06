<template>
  <div id="field-canvas"
    :style="turfStyle">
    <div id="tiles-container"
      :style="tileGridStyle">
      <div
        v-for="(tileData, index) in farmData.tileList"
        :key="index">
        <Tile
          :tileData="tileData"
          :currentAction="currentAction"/>
      </div>
    </div>
  </div>
</template>

<script>
import Tile from './FieldCanvas/Tile'

import FarmData from '@/library/FarmData'
import seasons from '@/library/seasons'
import field from '@/library/field'

const height = field.tileRows
const width = field.tileCols
const tileHeightPx = field.plotRowsPerTile * field.plotSizePx
const tileWidthPx = field.plotColsPerTile * field.plotSizePx
const farmData = new FarmData(height, width)

export default {
  name: 'FieldCanvas',
  props: ['currentAction', 'currentSeason'],
  components: {Tile},
  data () {
    return {farmData}
  },
  computed: {
    turfStyle () {
      const {turf} = seasons[this.currentSeason]
      return {
        backgroundImage: `url(../static/${turf})`
      }
    },
    tileGridStyle () {
      const gridTemplateRows = `${tileHeightPx}px `.repeat(height).trim()
      const gridTemplateColumns = `${tileWidthPx}px `.repeat(width).trim()
      return {
        gridTemplateRows,
        gridTemplateColumns
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#field-canvas {
  height: 100%;

  background-size: 768px;
  background-repeat: repeat;
  transition: background-image 0.5s ease-in-out;

  overflow: scroll;
}

#tiles-container {
  display: grid;
}

@media screen and (min-width: 780px) {
    #field-canvas {
      display: flex;
      justify-content: center;
      align-items: center;

      overflow: hidden;
    }

    #tiles-container {
      margin: 0px;
    }
  }
</style>
