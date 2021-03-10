<template>
  <div id="field-canvas"
    :style="fieldCanvasStyle">
    <div id="tiles-container"
      :style="tileGridStyle">
      <div
        v-for="(tileData, index) in farmData.tileList"
        :key="index">
        <Tile
          ref="tiles"
          :tileIndex="index"
          :tileData="tileData"
          :currentAction="currentAction"
          :currentSeason="currentSeason"
          :actionDetails="actionDetails"
          @changeCrop="updateAdjacentTiles"
          @inspect="inspect"
          @action="actionDone"/>
      </div>
    </div>
  </div>
</template>

<script>
import Tile from '@/components/FieldCanvas/Tile'

import FarmData from '@/library/FarmData'
import seasons from '@/library/seasons'
import field from '@/library/field'

import {getResourcePath} from '@/library/util'

const tileWidthPx = field.plotColsPerTile * field.plotSizePx
const tileHeightPx = field.plotRowsPerTile * field.plotSizePx

export default {
  name: 'FieldCanvas',
  props: [
    'currentAction',
    'currentSeason',
    'actionDetails',
    'fieldState'
  ],
  components: {Tile},
  data () {
    return {
      width: this.fieldState.width,
      height: this.fieldState.height,
      loaded: false,
      farmData: new FarmData(this.fieldState.width, this.fieldState.height, this.currentSeason)
    }
  },
  mounted () {
    this.loadFieldState()
  },
  methods: {
    updateAdjacentTiles (cropChangeDetails) {
      const {
        coordinates: sourceCoordinates,
        tile: sourceTileIndex,
        tileData: sourceTileData,
        from: fromType,
        to: toType
      } = cropChangeDetails;

      for (let tile of this.$refs.tiles) {
        if (
          sourceTileIndex !== tile.tileIndex &&
          Math.abs(tile.tileData.x - sourceTileData.x) <= 1 &&
          Math.abs(tile.tileData.y - sourceTileData.y) <= 1
        ) {
          tile.updateCropNeighbors(
            sourceCoordinates,
            fromType,
            toType
          )
        }
      }
    },
    toJSON () {
      return this.farmData.toJSON()
    },
    loadFieldState () {
      if (this.loaded) {
        return
      }

      this.loaded = true

      for (let tile of this.$refs.tiles) {
        const stringKey = `${tile.tileData.x},${tile.tileData.y}`

        if (this.fieldState.tiles[stringKey]) {
          tile.plow()
          tile.loadTileState(this.fieldState.tiles[stringKey])
        }
      }
    },
    inspect ({plotDetail, tileDetail}) {
      this.$emit(
        'inspect',
        {
          plotDetail,
          tileDetail
        }
      )
    },
    actionDone (action) {
      this.$emit('action', action)
    }
  },
  computed: {
    fieldCanvasStyle () {
      const turfPath = getResourcePath(seasons[this.currentSeason].turf)
      return {
        backgroundImage: `url(${turfPath})`,
        height: `${(tileHeightPx * this.height) + 80}px`,
        width: `${(tileWidthPx * this.width) + 80}px`
      }
    },
    tileGridStyle () {
      const gridTemplateRows = `${tileHeightPx}px `.repeat(this.height).trim()
      const gridTemplateColumns = `${tileWidthPx}px `.repeat(this.width).trim()
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
  background-size: 768px;
  background-repeat: repeat;
  transition: background-image 0.5s ease-in-out;
  position: relative;
  min-height: 100%;
  min-width: 100%;
}

#tiles-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: grid;
}

@media screen and (min-width: 780px) {
    #field-canvas {
      height: 100%;
      overflow: hidden;
      padding: 0px;
    }

    #tiles-container {
      margin: 0px;
    }
  }
</style>
