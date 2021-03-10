<template>
  <div 
    class="season-filter filter"
    :class="{'selected-filter': filter}"
    @click="triggerEvent">
    <img
      class="filter brown-icon"
      :src="imgSrc"/>
  </div>
</template>

<script>
import {getResourcePath} from '@/library/util'

export default {
  name: 'SeasonFilter',
  props: ['config'],
  data () {
    return {
      imgSrc: getResourcePath(this.config.symbol),
      filter: false
    }
  },
  methods: {
    triggerEvent () {
      this.filter = !this.filter
      this.$emit(
        'click',
        {
          season: this.config.season,
          filter: this.filter
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.season-filter img {
  height: 1em;
}
</style>
