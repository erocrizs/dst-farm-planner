<template>
  <div class="tile" :class="{plotted}" @click="clicked">
    <div v-if="plotted" class="plot-container">
      <div
        v-for="(plotData, index) in tileData.plotList"
        :key="index">
        <Plot
          :plotData="plotData"
          :currentAction="currentAction"
          :currentSeason="currentSeason"
          :actionDetails="actionDetails"
          :nutrientBalance="nutrientBalance"
          @plantCrop="plantCrop"
          @destroyCrop="destroyCrop"/>
      </div>
    </div>
  </div>
</template>

<script>
import Plot from './Plot'

import field from '@/library/field'
import crops from '@/library/crops'

const {plotSizePx} = field;

export default {
  name: 'Tile',
  components: {Plot},
  props: ['tileData', 'currentAction', 'currentSeason', 'actionDetails'],
  data () {
    return {
      plotted: this.tileData.plotted,
      nutrients: {
        growthFormula: 0,
        compost: 0,
        manure: 0
      }
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
    },
    nutrientBalance () {
      return this.nutrients.growthFormula >= 0
        && this.nutrients.compost >= 0
        && this.nutrients.manure >= 0
    }
  },
  methods: {
    clicked () {
      if (this.currentAction === 'plot' && !this.plotted) {
        this.tileData.plow()
        this.plotted = true
      }
      if (this.currentAction === 'flatten' && this.plotted) {
        this.tileData.destroyPlots()
        this.plotted = false
      }
    },
    plantCrop (crop) {
      for (let nutrient in crops[crop].nutrients) {
        this.nutrients[nutrient] += crops[crop].nutrients[nutrient]
      }
    },
    destroyCrop (crop) {
      for (let nutrient in crops[crop].nutrients) {
        this.nutrients[nutrient] -= crops[crop].nutrients[nutrient]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile {
  height: 100%;
  border: 2px dashed #cccccc70;
  box-sizing: border-box;
  background-image: none;
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
