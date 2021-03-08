<template>
  <div 
    class="save-slot"
    :class="{'selected-slot': selected}" @click="emitClick">
    Test save slot {{JSON.stringify(summary)}}
  </div>
</template>

<script>
export default {
  name: 'SaveSlot',
  props: ['selected', 'summary'],
  data () {
    return {}
  },
  methods: {
    emitClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
</style>