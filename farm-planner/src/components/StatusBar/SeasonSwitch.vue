<template>
  <img
    class="season-switch brown-icon"
    :class="{ 'selected-season': this.selected }"
    :src="imgSrc"
    @click="triggerEvent"/>
</template>

<script>

export default {
  name: 'SeasonSwitch',
  props: ['config', 'selected'],
  data () {
    return {
      imgSrc: './static/' + this.config.symbol
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
  border: thin solid transparent;
  margin-left: 10px;
  padding: 3px;
}

.selected-season { 
  border-color: white;
}
</style>
