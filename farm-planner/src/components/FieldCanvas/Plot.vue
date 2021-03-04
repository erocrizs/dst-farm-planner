<template>
  <div class="plot" :style="border">
    {{plotData.x}}, {{plotData.y}}
  </div>
</template>

<script>
export default {
  name: 'Plot',
  props: ['plotData', 'currentAction'],
  data () {
    return {
      border: {
        borderTopWidth: this.plotData.x > 0 ? '1px' : '0px',
        borderBottomWidth: this.plotData.x < 2 ? '1px' : '0px',
        borderLeftWidth: this.plotData.y > 0 ? '1px' : '0px',
        borderRightWidth: this.plotData.y < 2 ? '1px' : '0px'
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
}
</style>
