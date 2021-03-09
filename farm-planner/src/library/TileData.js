'use strict'

import PlotData from './PlotData'
import field from './field'

export {TileData as default}

class TileData {
  plots = []
  plotted = false
  growthFormula = 0
  compost = 0
  manure = 0
  
  constructor (x, y) {
    this.x = x
    this.y = y
    for (let row = 0; row < field.plotRowsPerTile; row++) {
      this.plots[row] = []
      for (let col = 0; col < field.plotColsPerTile; col++) {
        this.plots[row][col] = new PlotData(col, row)
      }
    }
  }
  
  getPlot (x, y) {
    return this.plots[x][y]
  }
  
  plow () {
    this.plotted = true
    this.growthFormula = 0
    this.compost = 0
    this.manure = 0
  }
  
  destroy () {
    this.plotted = false
  }
  
  get plotList () {
    return this.plots.reduce((acc, plotRow) => acc.concat(plotRow))
  }

  toJSON () {
    const json = {}
    
    for (let row = 0; row < field.plotRowsPerTile; row++) {
      for (let col = 0; col < field.plotColsPerTile; col++) {
        if (this.plots[row][col].crop) {
          json[`${col},${row}`] = this.plots[row][col].crop
        }
      }
    }

    return json
  }

  get nutrients () {
    return {
      growthFormula: this.growthFormula,
      compost: this.compost,
      manure: this.manure
    }
  }

  get seedUsed () {
    if (!this.plotted) {
      return {}
    }

    const tally = {}

    for (let row = 0; row < field.plotRowsPerTile; row++) {
      for (let col = 0; col < field.plotColsPerTile; col++) {
        const cropName = this.plots[row][col].crop
        if (cropName) {
          tally[cropName] = (tally[cropName] || 0) + 1
        }
      }
    }

    return tally
  }

  getOptimalYield (season) {
    const tally = {}
    const nutrients = this.nutrients

    for (let row = 0; row < field.plotRowsPerTile; row++) {
      for (let col = 0; col < field.plotColsPerTile; col++) {
        const plotData = this.plots[row][col]
        if (!plotData.crop) {
          continue
        }

        let cropTally = tally[plotData.crop]
        if (!cropTally) {
          cropTally = {crop: 0, seed: 0}
          tally[plotData.crop] = cropTally
        }

        const {cropYield, seedYield} = plotData.getOptimalYield(
          nutrients,
          season
        )

        cropTally.crop += cropYield
        cropTally.seed += seedYield
      }
    }

    return tally
  }
}