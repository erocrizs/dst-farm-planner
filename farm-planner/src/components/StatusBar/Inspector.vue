<template>
  <div id="inspector" class="column-flex remaining-height">
    <div class="section-header">
      Inspect Farm
    </div>

    <div id="inspect-farm">
      <div class="subsection-header">
        Farm Stats
      </div>
      <div class="detail-label">
        Total Seeds Needed:
      </div>
      <SeedList
        v-if="nonEmptyObject(farmDetail.seeds)"
        :seeds="farmDetail.seeds"/>
      <div v-else class="no-data">none</div>
      <div class="detail-label">
        Total Farm Yield: 
      </div>
      <YieldList
        v-if="nonEmptyObject(farmDetail.yield)"
        :yields="farmDetail.yield"/>
      <div v-else class="no-data">none</div>
    </div>

    <hr class="section-divider" v-if="tileDetail"/>

    <div id="inspect-tile" v-if="tileDetail">
      <div class="subsection-header">
        Tile Stats
      </div>
      <div class="detail-label">
        Ground Nutrient:
      </div>
      <NutrientList :nutrients="tileDetail.nutrients"/>
      <div class="detail-label">
        Seeds Needed:
      </div>
      <SeedList
        v-if="nonEmptyObject(tileDetail.seeds)"
        :seeds="tileDetail.seeds"/>
      <div v-else class="no-data">none</div>
      <div class="detail-label">
        Tile Yield:
      </div>
      <YieldList
        v-if="nonEmptyObject(tileDetail.yield)"
        :yields="tileDetail.yield"/>
      <div v-else class="no-data">none</div>
    </div>

    <hr class="section-divider" v-if="plotDetail"/>

    <div id="inspect-plot" v-if="plotDetail">
      <div class="subsection-header">
        Plot Status
      </div>
      <div class="detail-label">
        Crop Planted:
        <img :src="getCropImgSrc(plotDetail.crop)"/>
        <img :src="getSeedImgSrc(plotDetail.crop)" style="margin-left: -10px;"/>
        {{getCropName(plotDetail.crop)}}
      </div>
      <div class="detail-label">
        Nutrient Requirements:
      </div>
      <NutrientList :nutrients="plotDetail.nutrientRequirements"/>
      <div class="detail-label">
        Crop Yield:
      </div>
      <YieldList :yields="{[plotDetail.crop]: plotDetail.yield}"/>
      <div class="detail-label">
        Stress Factors:
      </div>
      <ul class="stress-factors">
        <li v-if="cropInSeason">
          Favors the current season
        </li>
        <li class="stress-fail" v-else>
          Out of season
          (this crop favors the seasons: {{cropFavoredSeasons.join(', ')}})
        </li>
        <li v-if="cropHasFamily">
          Has enough nearby family
        </li>
        <li class="stress-fail" v-else>
          Does not have enough nearby family
          (needs {{requiredFamily - plotDetail.family}} more nearby family)
        </li>
        <li v-if="cropMeetsNutrients">
          Meets all required ground nutrients
        </li>
        <li class="stress-fail" v-else>
          Does not meet all required ground nutrients
          (check the ground nutrients of the tile)
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NutrientList from './Inspector/NutrientList'
import YieldList from './Inspector/YieldList'
import SeedList from './Inspector/SeedList'

import crops from '@/library/crops'
import field from '@/library/field'

export default {
  name: 'Inspector',
  props: [
    'farmDetail',
    'tileDetail',
    'plotDetail',
    'season'
  ],
  components: {
    NutrientList,
    YieldList,
    SeedList
  },
  data () {
    return {}
  },
  methods: {
    nonEmptyObject (obj) {
      return obj && Object.keys(obj).length > 0
    },
    getCropImgSrc (crop) {
      return './static/' + crops[crop].src.normal
    },
    getSeedImgSrc (crop) {
      return './static/' + crops[crop].src.seeds
    },
    getCropName (crop) {
      return crops[crop].name
    }
  },
  computed: {
    cropInSeason () {
      return this.plotDetail.inSeason
    },
    cropHasFamily () {
      return this.plotDetail.hasFamily
    },
    cropMeetsNutrients () {
      return this.plotDetail.meetsNutrientRequirements.growthFormula
        && this.plotDetail.meetsNutrientRequirements.compost
        && this.plotDetail.meetsNutrientRequirements.manure
    },
    cropFavoredSeasons () {
      return crops[this.plotDetail.crop].seasons
    },
    requiredFamily () {
      return field.minimumFamily
    }
  }
}
</script>

<style scoped>
.subsection-header {
  margin-top: 10px;
  margin-bottom: 10px;
}

.detail-label {
  font-size: 0.8em;
}

.no-data {
  font-size: 0.8em;
  margin-left: 10px;
}

.detail-label img {
  display: inline-block;
  height: 1em;
}

.stress-factors {
  font-size: 0.8em;
  margin: 0px;
  margin-right: 15px;
}

.stress-fail {
  color: rgb(83, 13, 13);
}
</style>