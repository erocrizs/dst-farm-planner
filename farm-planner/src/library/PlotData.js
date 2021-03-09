'use strict'

import crops from '@/library/crops'
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

  getNutrientRequirement () {
    return this.crop
      ? getNutrientRequirement(this.crop)
      : null
  }

  meetsNutrientRequirements (tileNutrients) {
    if (!this.crop) {
      return null
    }

    const nutrientContribution = this.getNutrientRequirement()
    const result = {}

    for (let nutrient in tileNutrients) {
      result[nutrient] = (
        nutrientContribution[nutrient] >= 0 // doesn't need; or
        || tileNutrients[nutrient] + nutrientContribution[nutrient] >= 0 // tile fulfills needs
      )
    }

    return result
  }

  getStressPoints (tileNutrients, season) {
    const nutrientReport = this.meetsNutrientRequirements(tileNutrients)
    const meetsNutrients = nutrientReport.growthFormula
      && nutrientReport.compost
      && nutrientReport.manure

    const stressPerFactor = field.plantGrowthStages - 1 // skips fully grown stage

    return (this.hasFamily() ? 0 : stressPerFactor)
      + (this.inSeason(season) ? 0 : stressPerFactor)
      + (meetsNutrients ? 0 : stressPerFactor)
  }

  getOptimalYield (tileNutrients, season) {
    const stressPoints = this.getStressPoints(tileNutrients, season)
    return getOptimalYield(this.crop, stressPoints)
  }
}