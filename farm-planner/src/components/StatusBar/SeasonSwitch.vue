<template>
  <img
    class="season-switch brown-icon"
    :class="{ 'selected-season': this.selected }"
    :src="imgSrc"
    @click="triggerEvent"/>
</template>

<script>
import {getResourcePath} from '@/library/util'

export default {
  name: 'SeasonSwitch',
  props: ['config', 'selected'],
  data () {
    return {
      imgSrc: getResourcePath(this.config.symbol)
    }
  },
  methods: {
    triggerEvent () {
      this.$emit(
        'clicked',
        this.config.season
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.season-switch {
  display: inline;

  width: 1em;
  margin-left: 10px;
  padding: 3px;
}

.season-switch:hover {
  filter: drop-shadow(0px 0px 4px #ccc);
}

.selected-season { 
  filter: invert(100%) sepia(3%) saturate(575%) hue-rotate(244deg) brightness(115%) contrast(87%);
}

.selected-season:hover { 
  filter: invert(100%) sepia(3%) saturate(575%) hue-rotate(244deg) brightness(115%) contrast(87%) drop-shadow(0px 0px 4px #ccc);;
}
</style>
