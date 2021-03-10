'use strict'

import field from '@/library/field'
import {
  getNutrientRequirement,
  isCropInSeason,
  getOptimalYield
} from '@/library/util'

export {PlotData as default}

class PlotData {
  family = null

  constructor (x, y) {
    this.x = x
    this.y = y
    this.crop = null
  }
  
  plant (crop) {
    this.crop = crop
  }

  destroy () {
    this.crop = null
  }

  inSeason (season) {
    return this.crop
      ? isCropInSeason(this.crop, season)
      : false
  }

  hasFamily () {
    return  (this.family || 0) >= field.minimumFamily
  }

  get nutrientRequirements () {
    return this.crop
      ? getNutrientRequirement(this.crop)
      : null
  }

  meetsNutrientRequirements (tileNutrients) {
    if (!this.crop) {
      return null
    }

    return tileNutrients.growthFormula >= 0
      && tileNutrients.compost >= 0
      && tileNutrients.manure >= 0
  }

  getStressPoints (tileNutrients, season) {
    const stressPerFactor = field.plantGrowthStages - 1 // skips fully grown stage

    return (this.hasFamily() ? 0 : stressPerFactor)
      + (this.inSeason(season) ? 0 : stressPerFactor)
      + (this.meetsNutrientRequirements(tileNutrients) ? 0 : stressPerFactor)
  }

  getOptimalYield (tileNutrients, season) {
    const stressPoints = this.getStressPoints(tileNutrients, season)
    return getOptimalYield(this.crop, stressPoints)
  }

  inspectReport (tileNutrients, season) {
    return {
      x: this.x,
      y: this.y,
      crop: this.crop,
      season,
      inSeason: this.inSeason(season),
      family: this.family,
      hasFamily: this.hasFamily(),
      nutrientRequirements: this.nutrientRequirements,
      meetsNutrientRequirements: this.meetsNutrientRequirements(tileNutrients),
      stressPts: this.getStressPoints(tileNutrients, season),
      yield: this.getOptimalYield(tileNutrients, season)
    }
  }
  
  debugLog (tileNutrients, season) {
    console.log(this.inspectReport(tileNutrients, season))
  }
}