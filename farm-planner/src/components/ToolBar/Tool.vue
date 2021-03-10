<template>
  <img
    :class="{ selectedTool: this.selected }"
    :src="imgSrc"
    @click="triggerEvent"/>
</template>

<script>
import {getResourcePath} from '@/library/util'

export default {
  name: 'Tool',
  props: ['config', 'selected'],
  data () {
    return {
      imgSrc: getResourcePath(this.config.image)
    }
  },
  methods: {
    triggerEvent () {
      this.$emit(
        'clicked',
        this.selected ? null : this.config.action
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  display: block;
  background-size: cover;
  background-image: url("../../assets/toolbar/tool_bg.png");

  width: 50px;
  height: 50px;
  transition: width 0.2s, height 0.2s;
}

.selectedTool {
  width: 60px;
  height: 60px;
}
</style>
