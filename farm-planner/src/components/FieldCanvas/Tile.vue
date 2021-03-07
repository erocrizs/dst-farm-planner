<template>
  <div class="tile" :class="{plotted}" @click="clicked">
    <div v-if="plotted" class="plot-container">
      <div
        v-for="(plotData, index) in tileData.plotList"
        :key="index">
        <Plot
          :plotIndex="index"
          :plotData="plotData"
          :currentAction="currentAction"
          :currentSeason="currentSeason"
          :actionDetails="actionDetails"
          :growthFormula="growthFormula"
          :compost="compost"
          :manure="manure"
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
      cropList: [],
      growthFormula: 0,
      compost: 0,
      manure: 0
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
    plantCrop (cropType, index) {
      this.addCropNutrients(cropType)
      this.cropList[index] = cropType
    },
    destroyCrop (index) {
      const cropType = this.cropList[index]
      const growthSpeed = crops[cropType].seasons.includes(this.currentSeason) ? 1 : 0.5
      this.growthFormula -= crops[cropType].nutrients.growthFormula * growthSpeed
      this.compost -= crops[cropType].nutrients.compost * growthSpeed
      this.manure -= crops[cropType].nutrients.manure * growthSpeed

      this.cropList[index] = null
    },
    addCropNutrients (cropType) {
      const growthSpeed = crops[cropType].seasons.includes(this.currentSeason) ? 1 : 0.5
      this.growthFormula += crops[cropType].nutrients.growthFormula * growthSpeed
      this.compost += crops[cropType].nutrients.compost * growthSpeed
      this.manure += crops[cropType].nutrients.manure * growthSpeed
    }
  },
  watch: {
    currentSeason () {
      this.growthFormula = 0
      this.compost = 0
      this.manure = 0

      for (let cropType of this.cropList) {
        if (cropType) {
          this.addCropNutrients(cropType)
        }
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
