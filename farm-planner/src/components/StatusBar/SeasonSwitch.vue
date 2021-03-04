<template>
  <img
    class="season-switch"
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
      imgSrc: './static/' + this.config.image
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

  width: 1.5em;
  height: 1.5em;
}

.selected-season {
  background-color: white;
}
</style>
