<template>
  <div 
    class="crop-row" 
    :class="{'selected-crop': selected}"
    @click="triggerEvent">
    <div class="crop-row-layout">
      <div class="crop-header">
        <img :src="imgSrc" class="crop-image"/>
        <img :src="seedImgSrc" class="crop-image"/>
        <div class="crop-name">
          {{config.name}}
        </div>
      </div>
      <div class="crop-nutrients">
        <div
          v-for="(nutrient, index) in nutrients"
          :key="index">
          <img
            :src="staticPath(nutrient.imgSrc)"
            class="brown-icon"/> : {{config.nutrients[index]}}
        </div>
      </div>
      <div class="crop-seasons">
        <img
          v-for="(season, index) in seasons"
          :key="index"
          :src="staticPath(season.symbol)"
          class="brown-icon"/>
      </div>
    </div>
  </div>
</template>

<script>
import {seasons} from '../../Seasons/const'
import {nutrients} from '../const'


export default {
  name: 'CropRow',
  props: ['config', 'selected'],
  data () {
    return {
      imgSrc: './static/' + this.config.src.normal,
      seedImgSrc: './static/' + this.config.src.seeds,
      seasons: this.config.seasons.map(x => seasons[x]),
      nutrients
    }
  },
  methods: {
    staticPath (path) {
      return './static/' + path
    },
    triggerEvent () {
      this.$emit('click', this.selected ? null : this.config.crop)
    }
  }
}
</script>

<style scoped>
.crop-row {
  margin-bottom: 10px;
  border-left: 5px solid #342517;
  padding: 5px;
}

.crop-row:hover {
  background-color: #cccccc88
}

.crop-row.selected-crop {
  border-left: 5px solid #ccc;
}

.crop-image {
  height: 1.2em;
  width: 1.2em;
  background-image: url("../../../assets/toolbar/tool_bg.png");
  background-size: contain;
}

.crop-seasons img {
  height: 1em;
}

.crop-nutrients {
  font-size: 0.8em;
}

.crop-nutrients img {
  height: 1em;
}

.crop-header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.crop-header .crop-image {
  margin-right: 10px;
}

.crop-nutrients {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.crop-nutrients div {
  margin-left: 10px;
  margin-right: 10px;
}

.crop-seasons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.crop-seasons img {
  margin-left: 5px;
  margin-right: 5px;
}
</style>