<template>
  <div
    class="plot"
    :class="glowOnActionHover"
    :style="border"
    @click="handleClick">
    <img
      v-if="crop"
      :src="imgSrc"
      :style="customSize(crop)"
      :class="{'giant-glow': giant}"/>
  </div>
</template>

<script>
import crops from '@/library/crops'
import field from '@/library/field'
import {getResourcePath} from '@/library/util'

export default {
  name: 'Plot',
  props: [
    'plotIndex',
    'plotData',
    'currentAction',
    'currentSeason',
    'actionDetails',
    'nutrients'
  ],
  data () {
    const family = {}
    for (let crop in crops) {
      family[crop] = 0
    }

    return {
      border: {
        borderTopWidth: this.plotData.x > 0 ? '1px' : '0px',
        borderBottomWidth: this.plotData.x < 2 ? '1px' : '0px',
        borderLeftWidth: this.plotData.y > 0 ? '1px' : '0px',
        borderRightWidth: this.plotData.y < 2 ? '1px' : '0px'
      },
      crop: null,
      family
    }
  },
  methods: {
    handleClick (event) {
      let action;
      switch (this.currentAction) {
        case 'plant':
          action = this.plant(event)
          break
        case 'destroy':
          action = this.destroy(event)
          break
        case 'inspect':
          return this.inspect(event)
      }

      if (action && action.revert) {
        this.$emit('action', action)
      }
    },
    plant () {
      if (this.actionDetails && this.crop === null) {
        const action = this.plantCrop(this.actionDetails)
        return action
      }
      return {type: 'plant'}
    },
    plantCrop (crop) {
      this.plotData.plant(crop)
      this.crop = crop

      this.plotData.family = this.family[this.crop]

      this.$emit('plantCrop', this.crop, this.plotIndex)

      const action = {
        type: 'plantCrop',
        revert: () => this.destroy()
      }

      return action
    },
    destroy () {
      if (this.crop !== null) {
        const crop = this.crop
        this.plotData.destroy()
        this.crop = null

        this.plotData.family = null

        this.$emit('destroyCrop', this.plotIndex)

        return {
          type: 'destroy',
          revert: () => this.plantCrop(crop)
        }
      }
      return {type: 'destroy'}
    },
    inspect (event) {
      if (this.crop !== null) {
        this.$emit(
          'inspect',
          this.plotData.inspectReport(
            this.nutrients,
            this.currentSeason
          )
        )

        if (event) {
          event.stopPropagation()
        }
      }
    },
    customSize (crop) {
      const type = this.giant ? 'giant' : 'plant'
      const basisCrop = field.cropBasis[type]
      const basisWidth = crops[basisCrop].dimensions[type].x
      const cropDimensions = crops[crop].dimensions[type]
      const cropWidth = cropDimensions.x * cropDimensions.multiplier
      const plotSize = field.plotSizePx

      const width = cropWidth * plotSize / basisWidth

      return {width: `${width}px`}
    },
    neighborUpdated (fromType, toType) {
      if (fromType) {
        this.family[fromType]--;
      }
      if (toType) {
        this.family[toType]++;
      }
      if (this.crop) {
        this.plotData.family = this.family[this.crop]
      }
    }
  },
  computed: {
    imgSrc () {
      if (!this.crop) {
        return ''
      }

      const type = this.giant ? 'giant' : 'plant'
      return getResourcePath(crops[this.crop].src[type])
    },
    giant () {
      if (!this.crop) {
        return false
      }

      const seasonStress = !this.inSeason
      const familyStress = !this.hasFamily
      const nutrientStress = !this.nutrientBalance

      return !(seasonStress || familyStress || nutrientStress)
    },
    nutrientBalance () {
      return this.plotData.meetsNutrientRequirements(this.nutrients)
    },
    hasFamily () {
      return this.plotData.hasFamily()
    },
    inSeason () {
      return this.plotData.inSeason(this.currentSeason)
    },
    plantable () {
      return this.currentAction === 'plant'
        && this.crop === null
        && this.actionDetails !== null
    },
    destroyable () {
      return this.currentAction === 'destroy'
        && this.crop !== null
    },
    inspectable () {
      return this.currentAction === 'inspect'
        && this.crop !== null
    },
    glowOnActionHover () {
      return {
        'plot-glow-white': this.inspectable,
        'plot-glow-green': this.plantable,
        'plot-glow-red': this.destroyable
      }
    }
  },
  watch: {
    currentSeason () {
      if (this.currentAction === 'inspect') {
        this.inspect()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.plot {
  height: 100%;
  border-style: dashed;
  border-color: #231910;
  box-sizing: border-box;
  position: relative;
}

.plot img {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translate(-50%, 0%);
  pointer-events: none;
}

.giant-glow {
  filter: drop-shadow(0px 0px 2px #ccc)
}

.plot-glow-white:hover {
  background-color: #cccccc70;
}

.plot-glow-red:hover {
  background-color: #a7232370;
}

.plot-glow-green:hover {
  background-color: #157515c0;
}
</style>