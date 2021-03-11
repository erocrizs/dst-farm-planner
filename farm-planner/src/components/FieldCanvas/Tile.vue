<template>
  <div class="tile" :class="{plotted}" @click="clicked">
    <div class="plot-container"
      :class="glowOnActionHover"
      :style="plotGridStyle">
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
          @destroyCrop="cropDestroyed"
          @inspect="inspect"
          @action="actionDone"/>
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
      plotCropList: []
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
    },
    growthFormula () {
      return this.tileData.growthFormula
    },
    compost () {
      return this.tileData.compost
    },
    manure () {
      return this.tileData.manure
    },
    plowable () {
      return this.currentAction === 'plot' && !this.plotted
    },
    flattenable () {
      return this.currentAction === 'flatten' && this.plotted
    },
    inspectable () {
      return this.currentAction === 'inspect' && this.plotted
    },
    plotted () {
      return this.tileData.plotted
    },
    glowOnActionHover () {
      return {
        'glow-red': this.flattenable,
        'glow-green': this.plowable,
        'glow-white': this.inspectable
      }
    }
  },
  methods: {
    clicked () {
      let action;
      if (this.plowable) {
        action = this.plow()
      }
      else if (this.flattenable) {
        action = this.destroy()
      }
      else if (this.inspectable) {
        this.inspect(null)
      }

      if (action && action.revert) {
        this.actionDone(action)
      }
    },
    actionDone (action) {
      this.$emit('action', action)
    },
    plow () {
      this.tileData.plow()
      this.plotCropList = []
      return {
        type: 'plowTile',
        revert: () => this.destroy()
      }
    },
    destroy () {
      this.tileData.destroy()
      const destroyActions = []
      for (let plot of this.$refs.plots) {
        if (plot.crop) {
          const action = plot.destroy()
          if (action && action.revert) {
            destroyActions.push(action)
          } 
        }          
      }

      return {
        type: 'destroyTile',
        revert: () => {
          const action = this.plow()
          destroyActions.forEach(e => e.revert())
          return action
        }
      }
    },
    loadTileState (tileState) {
      for (let plot of this.$refs.plots) {
        const stringKey = `${plot.plotData.x},${plot.plotData.y}`

        if (tileState[stringKey]) {
          plot.plantCrop(tileState[stringKey])
        }
      }
    },
    inspect (plotDetail) {
      this.$emit(
        'inspect',
        {
          plotDetail,
          tileDetail: this.tileData.inspectReport(this.currentSeason)
        }
      )
    },
    cropPlanted (cropType, index) {
      this.addCropNutrients(cropType, 1)
      this.plotCropList[index] = cropType

      this.cropUpdated(index, null, cropType)
    },
    cropDestroyed (index) {
      const cropType = this.plotCropList[index]
      this.addCropNutrients(cropType, -1)

      this.plotCropList[index] = null
      this.cropUpdated(index, cropType, null)
    },
    addCropNutrients (cropType, sign = 1) {
      const additiveSign = Math.sign(sign)
      const cropNutrients = crops[cropType].nutrients
      const growthSpeed = crops[cropType].seasons.includes(this.currentSeason)
        ? field.growthSpeed.inSeason
        : field.growthSpeed.offSeason

      for (let nutrient in cropNutrients) {
        this.tileData[nutrient] += (cropNutrients[nutrient] * growthSpeed * additiveSign)
      }
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
    }
  },
  watch: {
    currentSeason () {
      this.tileData.growthFormula = 0
      this.tileData.compost = 0
      this.tileData.manure = 0

      for (let cropType of this.plotCropList) {
        if (cropType) {
          this.addCropNutrients(cropType, 1)
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

.empty-plot {
  pointer-events: none;
}

.glow-white:hover {
  background-color: #cccccc20;
}

.glow-red:hover {
  background-color: #a7232320;
}

.glow-green:hover {
  background-color: #1575158e;
}
</style>
