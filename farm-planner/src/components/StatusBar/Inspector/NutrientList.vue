<template>
  <div class="nutrient-list">
    <div class="nutrient-count"
      v-for="(count, nutrient) in nutrients"
      :key="nutrient">
      <img :src="imgSrc(nutrient)" class="brown-icon"/>
      : {{count}}
    </div>
  </div>
</template>

<script>
import nutrients from '@/library/nutrients'

export default {
  name: 'NutrientList',
  props: ['nutrients'],
  data () {
    return {}
  },
  methods: {
    imgSrc (nutrient) {
      return './static/' + nutrients[nutrient].imgSrc
    }
  }
}
</script>

<style scoped>
.nutrient-list {
  font-size: 0.8em;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}

.nutrient-count img {
  display: inline-block;
  height: 1em; 
}
</style>