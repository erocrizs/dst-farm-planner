<template>
  <div class="plot" :style="border" @click="handleClick">
    <img v-if="crop" :src="imgSrc"/>
  </div>
</template>

<script>
import crops from '@/library/crops'

export default {
  name: 'Plot',
  props: ['plotData', 'currentAction', 'actionDetails'],
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
      }
    },
    plantCrop () {
      if (this.actionDetails) {
        this.plotData.plant(this.actionDetails)
        this.crop = this.actionDetails
      }
    }
  },
  computed: {
    imgSrc () {
      return './static/' + crops[this.crop].src.plant
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
  width: 100%;
  bottom: 3px;
  left: 50%;
  transform: translate(-50%, 0%);
  pointer-events: none;
}
</style>
