<template>
  <img 
    :src="imgSrc"
    @click="triggerEvent"
    />
</template>

<script>

export default {
  name: 'Tool',
  props: ['config'],
  data () {
    return {
      imgSrc: './static/' + this.config.image
    }
  },
  methods: {
    triggerEvent () {
      this.$emit('clicked', this.config.action)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 50px;
  height: 50px;
  background-size: cover;
  background-image: url("../../assets/toolbar/tool_bg.png");
}
</style>
