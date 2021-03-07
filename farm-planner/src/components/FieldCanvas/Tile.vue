<template>
  <div class="tile" :class="{plotted}" @click="clicked">
    <div v-if="plotted" class="plot-container">
      <div
        v-for="(plotData, index) in tileData.plotList"
        :key="index">
        <Plot
          ref="plots"
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
      plotCropList: [],
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
        this.plotCropList = []
        this.growthFormula = 0
        this.compost = 0
        this.manure = 0
      }
      if (this.currentAction === 'flatten' && this.plotted) {
        this.tileData.destroyPlots()
        this.plotted = false
      }
    },
    plantCrop (cropType, index) {
      this.addCropNutrients(cropType)
      this.plotCropList[index] = cropType

      this.updateCrops(index, null, cropType)
    },
    destroyCrop (index) {
      const cropType = this.plotCropList[index]
      const growthSpeed = crops[cropType].seasons.includes(this.currentSeason) ? 1 : 0.5
      this.growthFormula -= crops[cropType].nutrients.growthFormula * growthSpeed
      this.compost -= crops[cropType].nutrients.compost * growthSpeed
      this.manure -= crops[cropType].nutrients.manure * growthSpeed

      this.plotCropList[index] = null
      this.updateCrops(index, cropType, index)
    },
    addCropNutrients (cropType) {
      const growthSpeed = crops[cropType].seasons.includes(this.currentSeason) ? 1 : 0.5
      this.growthFormula += crops[cropType].nutrients.growthFormula * growthSpeed
      this.compost += crops[cropType].nutrients.compost * growthSpeed
      this.manure += crops[cropType].nutrients.manure * growthSpeed
    },
    updateCrops (index, fromType, toType) {
      for (let plot of this.$refs.plots) {
        if (plot.plotIndex !== index) {
          plot.neighborUpdated(fromType, toType)
        }
      }

      this.emitChangeCropEvent(index, fromType, toType)
    },
    emitChangeCropEvent (index, fromType, toType) {
      const coordinates = this.plotIndexToXY(index)
      const eventBody = {
        coordinates,
        from: fromType,
        to: toType
      }
      this.$emit('changeCrop', eventBody)  
    },
    plotIndexToInternalXY (index) {
      return {
        x: index % 3,
        y: Math.floor(index / 3)
      }
    },
    plotIndexToXY (index) {
      const {x, y} = this.plotIndexToInternalXY(index)

      return {
        x: (this.tileData.x * 3) + x,
        y: (this.tileData.y * 3) + y
      }
    },
    plotXYToIndex (x, y) {
      const internalX = x - Math.floor(x / (this.tileData.x * 3))
      const internalY = y - Math.floor(y / (this.tileData.y * 3))
      return (3 * y) + x
    }
  },
  watch: {
    currentSeason () {
      this.growthFormula = 0
      this.compost = 0
      this.manure = 0

      for (let cropType of this.plotCropList) {
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
