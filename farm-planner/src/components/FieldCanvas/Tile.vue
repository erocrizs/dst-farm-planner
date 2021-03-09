<template>
  <div class="tile" :class="{plotted}" @click="clicked">
    <div class="plot-container" :style="plotGridStyle">
      <div
        :style="showWhenPlotted"
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
          @plantCrop="cropPlanted"
          @destroyCrop="cropDestroyed"/>
      </div>
    </div>
  </div>
</template>

<script>
import Plot from './Plot'

import field from '@/library/field'
import crops from '@/library/crops'

const {
  plotSizePx,
  plotColsPerTile,
  plotRowsPerTile,
  maxNeighborDistance
} = field;

export default {
  name: 'Tile',
  components: {Plot},
  props: [
    'tileIndex',
    'tileData',
    'currentAction',
    'currentSeason',
    'actionDetails'
  ],
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
      const gridTemplateRows = `${plotSizePx}px `.repeat(plotRowsPerTile).trim()
      const gridTemplateColumns = `${plotSizePx}px `.repeat(plotColsPerTile).trim()
      return {
        display: 'grid',
        gridTemplateRows,
        gridTemplateColumns
      }
    },
    showWhenPlotted () {
      return {
        visibility: this.plotted ? 'visible' : 'hidden'
      }
    }
  },
  methods: {
    clicked () {
      if (this.currentAction === 'plot' && !this.plotted) {
        this.plow()
      }
      if (this.currentAction === 'flatten' && this.plotted) {
        this.tileData.destroy()
        this.plotted = false

        for (let plot of this.$refs.plots) {
          if (plot.crop) {
            plot.destroyCrop()
          }          
        }
      }
    },
    plow () {
      this.tileData.plow()
      this.plotted = true
      this.plotCropList = []
      this.growthFormula = 0
      this.compost = 0
      this.manure = 0
    },
    loadTileState (tileState) {
      for (let plot of this.$refs.plots) {
        const stringKey = `${plot.plotData.x},${plot.plotData.y}`

        if (tileState[stringKey]) {
          plot.plantCrop(tileState[stringKey])
        }
      }
    },
    cropPlanted (cropType, index) {
      this.addCropNutrients(cropType)
      this.plotCropList[index] = cropType

      this.cropUpdated(index, null, cropType)
    },
    cropDestroyed (index) {
      const cropType = this.plotCropList[index]
      const growthSpeed = crops[cropType].seasons.includes(this.currentSeason) ? 1 : 0.5
      this.growthFormula -= crops[cropType].nutrients.growthFormula * growthSpeed
      this.compost -= crops[cropType].nutrients.compost * growthSpeed
      this.manure -= crops[cropType].nutrients.manure * growthSpeed

      this.plotCropList[index] = null
      this.cropUpdated(index, cropType, null)
    },
    addCropNutrients (cropType) {
      const growthSpeed = crops[cropType].seasons.includes(this.currentSeason) ? 1 : 0.5
      this.growthFormula += crops[cropType].nutrients.growthFormula * growthSpeed
      this.compost += crops[cropType].nutrients.compost * growthSpeed
      this.manure += crops[cropType].nutrients.manure * growthSpeed
    },
    cropUpdated (index, fromType, toType) {
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
        tile: this.tileIndex,
        tileData: this.tileData,
        from: fromType,
        to: toType
      }

      this.$emit('changeCrop', eventBody)  
    },
    updateCropNeighbors (sourceCoordinates, fromType, toType) {
      for (let plot of this.$refs.plots) {
        const plotCoordinates = this.plotIndexToXY(plot.plotIndex)
        const distance = this.getDistance(sourceCoordinates, plotCoordinates)
        if (distance < maxNeighborDistance) {
          plot.neighborUpdated(fromType, toType)
        }
      }
    },
    getDistance (positionA, positionB) {
      const diffX = (positionA.x - positionB.x)
      const diffY = (positionA.y - positionB.y)
      return Math.sqrt((diffX * diffX) + (diffY * diffY))
    },
    plotIndexToInternalXY (index) {
      return {
        x: index % plotColsPerTile,
        y: Math.floor(index / plotColsPerTile)
      }
    },
    plotIndexToXY (index) {
      const {x, y} = this.plotIndexToInternalXY(index)

      return {
        x: (this.tileData.x * plotColsPerTile) + x,
        y: (this.tileData.y * plotRowsPerTile) + y
      }
    },
    plotXYToIndex (x, y) {
      const internalX = x - Math.floor(x / (this.tileData.x * plotColsPerTile))
      const internalY = y - Math.floor(y / (this.tileData.y * plotRowsPerTile))
      return (plotColsPerTile * y) + x
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
  background-repeat: repeat;
  border: 2px solid #231910;
}

.plot-container {
  height: 100%;
}
</style>
