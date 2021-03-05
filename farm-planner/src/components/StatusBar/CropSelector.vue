<template>
  <div id="crop-selector">
    <div id="crop-filters">
      <div id="crop-nutrient-filters">
        <NutrientFilter
          v-for="(nutrient, index) in nutrients"
          :key="index"
          :config="nutrient"
          @click="setNutrientFilter"
          />
      </div>
      <div id="crop-season-filters">
        
      </div>
    </div>
    <div id="crop-seeds">
      Seeds
    </div>
  </div>
</template>

<script>
import NutrientFilter from './CropSelector/NutrientFilter'
import {nutrients, intakes} from './const';
 
export default {
  name: 'CropSelector',
  props: ['currentAction', 'actionDetails'],
  components: {NutrientFilter},
  data () {
    return {
      filters: {
        seasons: {},
        nutrients: {}
      },
      nutrients
    }
  },
  methods: {
    cropClicked (actionDetails) {
      if (this.actionDetails !== actionDetails) {
        this.$emit('setActionDetails', actionDetails)
      }
    },
    staticPath (path) {
      return './static/' + path
    },
    setNutrientFilter ({nutrient, filter}) {
      this.filters.nutrients[nutrient] = filter
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#crop-filter {
  padding-top: 15px;
  padding-bottom: 15px;
}

#crop-nutrient-filters {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}

.filter:hover img {
  filter: drop-shadow(0px 0px 4px #ccc);
}

.selected-filter img { 
  filter: invert(100%) sepia(3%) saturate(575%) hue-rotate(244deg) brightness(115%) contrast(87%);
}

.selected-filter:hover img { 
  filter: invert(100%) sepia(3%) saturate(575%) hue-rotate(244deg) brightness(115%) contrast(87%) drop-shadow(0px 0px 4px #ccc);;
}
</style>
