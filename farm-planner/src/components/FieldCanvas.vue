<template>
  <div id="field-canvas"
    :style="turfStyle">
    Field Canvas
  </div>
</template>

<script>
import FarmData from '../library/FarmData'
import {seasons} from './Seasons/const'

const farmData = new FarmData(3, 3)

export default {
  name: 'FieldCanvas',
  props: ['currentAction', 'currentSeason'],
  data () {
    return {farmData}
  },
  computed: {
    turfStyle () {
      const {turf} = seasons[this.currentSeason]
      return {
        backgroundImage: `url(../static/${turf})`
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#field-canvas {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background-size: 768px;
  background-repeat: repeat;
  transition: background-image 0.5s ease-in-out;
}
</style>
