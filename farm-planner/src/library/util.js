'use strict';

import seasons from './seasons'
import crops from './crops'
import field from './field'

export {
  verifyFieldState,
  isInteger,
  isString,
  valueBetweenInclusive,
  getNutrientRequirement,
  getFavoredSeasons,
  isCropInSeason,
  getOptimalYield
}

function verifyFieldState (fieldState) {
  const {width, height, season, tiles} = fieldState

  return isInteger(width)
    && valueBetweenInclusive(width, field.minFarmSize, field.maxFarmSize)
    && isInteger(height)
    && valueBetweenInclusive(height, field.minFarmSize, field.maxFarmSize)
    && isString(season)
    && !!seasons[season]
    && verifyFieldStateTiles(tiles, width, height)
}

function verifyFieldStateTiles (fieldStateTiles, farmWidth, farmHeight) {
  if (typeof fieldStateTiles !== 'object') {
    return false
  }

  for (let coordString in fieldStateTiles) {
    if (!coordString.match(/^\d+,\d+$/)) {
      return false
    }

    const coords = coordString.split(',')
    const x = +coords[0]
    const y = +coords[1]

    const validCoords = (coords.length === 2)
      && isInteger(x)
      && valueBetweenInclusive(x, 0, farmWidth - 1)
      && isInteger(y)
      && valueBetweenInclusive(y, 0, farmHeight - 1)
      && verifyFieldStatePlots(fieldStateTiles[coordString])
    
    if (!validCoords) {
      return false
    }
  }

  return true
}

function verifyFieldStatePlots (fieldStateTilePlots) {
  if (typeof fieldStateTilePlots !== 'object') {
    return false
  }

  for (let coordString in fieldStateTilePlots) {
    if (!coordString.match(/^\d+,\d+$/)) {
      return false
    }

    const coords = coordString.split(',')
    const x = +coords[0]
    const y = +coords[1]

    const validCoords = (coords.length === 2)
      && isInteger(x)
      && valueBetweenInclusive(x, 0, field.plotColsPerTile - 1)
      && isInteger(y)
      && valueBetweenInclusive(y, 0, field.plotRowsPerTile - 1)
      && !!crops[fieldStateTilePlots[coordString]]
    
    if (!validCoords) {
      return false
    }
  }

  return true
}

function isInteger (data) {
  return typeof data === 'number'
    && Math.floor(data) === data
}

function isString (data) {
  return typeof data === 'string'
}

function valueBetweenInclusive (number, minInclusive, maxExclusive) {
  return minInclusive <= number
    && number <= maxExclusive
}

function getNutrientRequirement (cropName) {
  return crops[cropName].nutrients
}

function getFavoredSeasons (cropName) {
  return crops[cropName].seasons
}

function isCropInSeason (cropName, season) {
  return getFavoredSeasons(cropName).includes(season)
}

function getOptimalYield (crop, stressPoints) {
  let cropYield = 0
  let seedYield = 0

  for (let yieldTier of field.cropYieldTiers) {
    if (
      valueBetweenInclusive(stressPoints, yieldTier.minStress, yieldTier.maxStress)
    ) {
      cropYield = yieldTier.cropYield
      seedYield = yieldTier.seedYield
      break
    }
  }

  return {cropYield, seedYield}
}