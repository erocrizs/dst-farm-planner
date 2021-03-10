<template>
  <div class="seed-list">
    <div class="seed-count"
      v-for="(count, crop) in seeds"
      :key="crop">
      <img class="seed-img" :src="src(crop, 'seeds')"/>
      <img class="crop-img" :src="src(crop, 'normal')"/>
      x {{count}}
    </div>
  </div>
</template>

<script>
import crops from '@/library/crops'
import {getResourcePath} from '@/library/util'

export default {
  name: 'SeedList',
  props: ['seeds'],
  data () {
    return {}
  },
  methods: {
    src (crop, type) {
      return getResourcePath(crops[crop].src[type])
    }
  }
}
</script>

<style scoped>
.seed-list {
  font-size: 0.8em;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: flex-start;
}

.seed-count {
  margin-right: 15px;
}

.seed-count img {
  display: inline-block;
  height: 1em; 
}

.seed-count .crop-img {
  margin-left: -5px;
}
</style>