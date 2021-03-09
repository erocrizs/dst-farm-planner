<template>
  <div class="yield-list">
    <div class="yield-count"
      v-for="(yieldCount, index) in yieldList"
      :key="index">
      <img class="yield-img" :src="yieldCount.imgSrc"/>
      x {{yieldCount.count}}
    </div>
  </div>
</template>

<script>
import crops from '@/library/crops'

export default {
  name: 'YieldList',
  props: ['yields'],
  data () {
    const yieldList = []

    for (let crop in this.yields) {
      yieldList.push({
        imgSrc: './static/' + crops[crop].src.normal,
        count: this.yields[crop].crop
      })

      yieldList.push({
        imgSrc: './static/' + crops[crop].src.seeds,
        count: this.yields[crop].seed
      })
    }

    return {yieldList}
  }
}
</script>

<style scoped>
.yield-list {
  font-size: 0.8em;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: flex-start;
}

.yield-count {
  margin-right: 15px;
}

.yield-count img {
  display: inline-block;
  height: 1em; 
}
</style>