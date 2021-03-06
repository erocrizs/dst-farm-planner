<template>
  <div 
    class="nutrient-filter filter"
    :class="selectedFilter"
    @click="toggleNutrientFilter()">
    <img
      :src="staticPath(config.imgSrc)"
      class="label brown-icon"/>
    <img 
      :src="staticPath(intakeSrc)"
      class="filter brown-icon"/>
  </div>
</template>

<script>
export default {
  name: 'NutrientFilter',
  props: ['config'],
  data () {
    return {
      filter: null,
    }
  },
  methods: {
    staticPath (path) {
      return './static/' + path
    },
    toggleNutrientFilter () {
      if (this.filter === null) {
        this.filter = '+';
      }
      else if (this.filter === '+') {
        this.filter = '-';
      }
      else {
        this.filter = null;
      }

      this.$emit(
        'click',
        {
          nutrient: this.config.nutrient,
          filter: this.filter
        }
      )
    }
  },
  computed: {
    selectedFilter () {
      return {
        'selected-filter': this.filter !== null
      }
    },
    intakeSrc () {
      switch (this.filter) {
        case '+':
          return 'nutrients/nutrient-one-down.png'
        case '-':
          return 'nutrients/nutrient-one-up.png'
        default:
          return 'nutrients/nutrient-neutral.png'
      }
    }
  }
}
</script>

<style scoped>
.nutrient-filter {  
  display: grid;
  grid-template: 1em / 1em 1em;
}

.nutrient-filter img.label {
  height: 100%;
  grid-area: 1 / 1 / span 1 / span 1;
  box-sizing: border-box;
}

.nutrient-filter img.filter {
  grid-area: 1 / 2 / span 1 / span 1;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
}
</style>