'use strict'

import PlotData from './PlotData'

export {TileData as default}

class TileData {
  plots = []
  plotted = false
  
  constructor (x, y) {
    this.x = x
    this.y = y
    for (let row = 0; row < 3; row++) {
      this.plots[row] = []
      for (let col = 0; col < 3; col++) {
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
}