<template>
  <div
    class="plot"
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

export default {
  name: 'Plot',
  props: [
    'plotIndex',
    'plotData',
    'currentAction',
    'currentSeason',
    'actionDetails',
    'growthFormula',
    'compost',
    'manure',
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
    handleClick () {
      switch (this.currentAction) {
        case 'plant':
          return this.plantCrop()
        case 'destroy':
          return this.destroyCrop()
      }
    },
    plantCrop () {
      if (this.actionDetails && this.crop === null) {
        this.plotData.plant(this.actionDetails)
        this.crop = this.actionDetails
        this.$emit('plantCrop', this.crop, this.plotIndex)
      }
    },
    destroyCrop () {
      if (this.crop !== null) {
        this.plotData.destroy()
        this.crop = null
        this.$emit('destroyCrop', this.plotIndex)
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
    }
  },
  computed: {
    imgSrc () {
      if (!this.crop) {
        return ''
      }

      const type = this.giant ? 'giant' : 'plant'
      return './static/' + crops[this.crop].src[type]
    },
    giant () {
      if (!this.crop) {
        return false
      }

      const seasonStress = !crops[this.crop]
        .seasons
        .includes(this.currentSeason)

      const familyStress = this.family[this.crop] < 3

      const nutrientStress = !this.nutrientBalance

      return !(seasonStress || familyStress || nutrientStress)
    },
    nutrientBalance () {
      return this.growthFormula >= 0
        && this.compost >= 0
        && this.manure >= 0
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
</style>