<template>
  <div
    class="plot"
    :style="border"
    @click="handleClick">
    <img
      v-if="crop"
      :src="imgSrc"
      :style="customSize(crop)"/>
  </div>
</template>

<script>
import crops from '@/library/crops'
import field from '@/library/field'

export default {
  name: 'Plot',
  props: ['plotData', 'currentAction', 'actionDetails', 'giant'],
  data () {
    return {
      border: {
        borderTopWidth: this.plotData.x > 0 ? '1px' : '0px',
        borderBottomWidth: this.plotData.x < 2 ? '1px' : '0px',
        borderLeftWidth: this.plotData.y > 0 ? '1px' : '0px',
        borderRightWidth: this.plotData.y < 2 ? '1px' : '0px'
      },
      crop: null
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
      }
    },
    destroyCrop () {
      if (this.crop !== null) {
        this.plotData.destroy()
        this.crop = null
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
    }
  },
  computed: {
    imgSrc () {
      const type = this.giant ? 'giant' : 'plant'
      return './static/' + crops[this.crop].src[type]
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
</style>