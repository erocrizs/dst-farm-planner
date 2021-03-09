<template>
  <div class="yield-list">
    Yield List: {{JSON.stringify(yields)}}
  </div>
</template>

<script>
export default {
  name: 'YieldList',
  props: ['yields'],
  data () {
    return {}
  }
}
</script>

<style scoped>
.yield-list {
  font-size: 0.8em;
}
</style>