'use strict'

import PlotData from './PlotData'
import field from './field'

export {TileData as default}

class TileData {
  plots = []
  plotted = false
  
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
}