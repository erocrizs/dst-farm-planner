<template>
  <div id="crop-selector" class="column-flex remaining-height">
      <div class="section-header">
        Plant Crops
      </div>
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
        <SeasonFilter
          v-for="(season, index) in seasons"
          :key="index"
          :config="season"
          @click="seasonClicked"/>
      </div>
    </div>
    <div id="crop-list" class="column-flex remaining-height">
      <CropRow
        v-for="(config, index) in crops"
        :key="index"
        :selected="isCropSelected(config.crop)"
        :config="config"
        @click="cropClicked"/>
    </div>
  </div>
</template>

<script>
import CropRow from './CropSelector/CropRow'
import SeasonFilter from './CropSelector/SeasonFilter'
import NutrientFilter from './CropSelector/NutrientFilter'

import nutrients from '@/library/nutrients'
import seasons from '@/library/seasons'
import crops from '@/library/crops'
 
export default {
  name: 'CropSelector',
  props: ['currentAction', 'actionDetails'],
  components: {NutrientFilter, SeasonFilter, CropRow},
  data () {
    return {
      filters: {
        seasons: {},
        nutrients: {}
      },
      nutrients,
      seasons,
      crops
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
      this.crops = this.filterCrops()
    },
    isSeasonSelected (season) {
      return !!this.filters.seasons[season]
    },
    seasonClicked ({season, filter}) {
      this.filters.seasons[season] = filter
      this.crops = this.filterCrops()
    },
    isCropSelected (crop) {
      return this.actionDetails === crop
    },
    filterCrops () {
      const filteredCrops = {}

      for (let cropKey in crops) {
        const cropConfig = crops[cropKey]
        let include = true

        for (let season in this.filters.seasons) {
          const requiredSeason = !!this.filters.seasons[season]
          if (requiredSeason && !cropConfig.seasons.includes(season)) {
            include = false
            break
          }
        }

        for (let nutrient in this.filters.nutrients) {
          const nutrientIntake = this.filters.nutrients[nutrient]
          const failPositive = (nutrientIntake === '+' && cropConfig.nutrients[nutrient] < 0)
          const failNegative = (nutrientIntake === '-' && cropConfig.nutrients[nutrient] > 0)
          if (failPositive || failNegative) {
            include = false
            break
          }
        }

        if (include) {
          filteredCrops[cropKey] = cropConfig
        }
      }

      return filteredCrops
    }
  }
}
</script>

<style>
#crop-filter {
  padding-top: 15px;
  padding-bottom: 15px;
}

#crop-nutrient-filters, #crop-season-filters {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  padding: 15px;
  padding: 15px;
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
